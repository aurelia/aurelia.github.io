#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const OPENCOLLECTIVE_API = 'https://api.opencollective.com/graphql/v2';
const COLLECTIVE_SLUG = 'aurelia';
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'sponsors.json');
const EXCLUSIONS_PATH = path.join(__dirname, '..', 'data', 'sponsor-exclusions.json');
const TIER_OVERRIDES_PATH = path.join(__dirname, '..', 'data', 'sponsor-tier-overrides.json');
const SPONSOR_ALIASES_PATH = path.join(__dirname, '..', 'data', 'sponsor-aliases.json');
const DISPLAYED_TIERS = new Set(['wood', 'bronze', 'silver', 'gold', 'platinum']);

const QUERY = `
  query {
    collective(slug: "${COLLECTIVE_SLUG}") {
      orders(status: ACTIVE, limit: 500) {
        nodes {
          status
          frequency
          amount { value }
          fromAccount {
            slug
            name
            imageUrl
            website
          }
          tier {
            slug
          }
        }
      }
    }
  }
`;

async function fetchActiveSponsors() {
  const response = await fetch(OPENCOLLECTIVE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: QUERY }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  return data.data.collective.orders.nodes;
}

function normalize(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function getHostname(value) {
  try {
    return new URL(value).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

function resolveCanonicalSlug(accountSlug, sponsorAliases = {}) {
  for (const [canonicalSlug, aliasGroup] of Object.entries(sponsorAliases)) {
    if (accountSlug === canonicalSlug || aliasGroup.aliases.includes(accountSlug)) {
      return canonicalSlug;
    }
  }

  return accountSlug;
}

function validateSponsorAliases(sponsorAliases) {
  const claimedSlugs = new Set();

  for (const [canonicalSlug, aliasGroup] of Object.entries(sponsorAliases)) {
    if (!aliasGroup || !Array.isArray(aliasGroup.aliases)) {
      throw new Error(`Sponsor alias group for ${canonicalSlug} must include an aliases array`);
    }
    if (aliasGroup.title !== undefined
      && (typeof aliasGroup.title !== 'string' || aliasGroup.title.trim() === '')) {
      throw new Error(`Sponsor alias group for ${canonicalSlug} has an invalid title`);
    }

    for (const slug of [canonicalSlug, ...aliasGroup.aliases]) {
      if (typeof slug !== 'string' || slug.trim() === '') {
        throw new Error(`Sponsor alias group for ${canonicalSlug} contains an invalid slug`);
      }
      if (slug !== canonicalSlug && aliasGroup.aliases.filter(alias => alias === slug).length > 1) {
        throw new Error(`Sponsor alias is duplicated in ${canonicalSlug}: ${slug}`);
      }
      if (claimedSlugs.has(slug)) {
        throw new Error(`Sponsor slug belongs to multiple alias groups: ${slug}`);
      }
      claimedSlugs.add(slug);
    }
  }
}

function findExclusion(order, exclusions, sponsorAliases = {}) {
  const account = order.fromAccount;
  const slug = account.slug.toLowerCase();
  const canonicalSlug = resolveCanonicalSlug(slug, sponsorAliases).toLowerCase();

  if (exclusions.blockedSlugs.some(blockedSlug => {
    const normalizedBlockedSlug = blockedSlug.toLowerCase();
    return normalizedBlockedSlug === slug || normalizedBlockedSlug === canonicalSlug;
  })) {
    return `blocked slug: ${slug}`;
  }

  const hostname = getHostname(account.website);
  const blockedDomain = exclusions.blockedDomains.find(domain => {
    const normalizedDomain = domain.toLowerCase().replace(/^www\./, '');
    return hostname === normalizedDomain || hostname.endsWith(`.${normalizedDomain}`);
  });
  if (blockedDomain) {
    return `blocked domain: ${blockedDomain}`;
  }

  const searchable = normalize([account.slug, account.name, account.website].join(' '));
  const blockedTerm = exclusions.blockedTerms.find(term => searchable.includes(normalize(term)));
  return blockedTerm ? `blocked term: ${blockedTerm}` : null;
}

function filterExcludedSponsors(orders, exclusions, sponsorAliases = {}) {
  validateSponsorAliases(sponsorAliases);

  const included = [];
  const excluded = [];

  for (const order of orders) {
    const reason = findExclusion(order, exclusions, sponsorAliases);
    if (reason) {
      excluded.push({ order, reason });
    } else {
      included.push(order);
    }
  }

  return { included, excluded };
}

function validateTierOverrides(tierOverrides) {
  for (const [accountSlug, override] of Object.entries(tierOverrides)) {
    if (!DISPLAYED_TIERS.has(override.tier)) {
      throw new Error(`Invalid tier override for ${accountSlug}: ${override.tier}`);
    }
    if (typeof override.reason !== 'string' || override.reason.trim() === '') {
      throw new Error(`Tier override for ${accountSlug} must include a reason`);
    }
  }
}

function groupByTier(orders, tierOverrides = {}, sponsorAliases = {}) {
  validateTierOverrides(tierOverrides);
  validateSponsorAliases(sponsorAliases);

  const tiers = {};
  const seen = new Map();

  for (const order of orders) {
    const accountSlug = order.fromAccount.slug;
    const canonicalSlug = resolveCanonicalSlug(accountSlug, sponsorAliases);
    const tierSlug = tierOverrides[accountSlug]?.tier
      ?? tierOverrides[canonicalSlug]?.tier
      ?? order.tier?.slug
      ?? 'unknown';

    // Dedupe repeated orders and manually linked regional or alternate accounts.
    const key = `${tierSlug}:${canonicalSlug}`;
    const existingIndex = seen.get(key);
    if (existingIndex !== undefined && accountSlug !== canonicalSlug) continue;

    if (!tiers[tierSlug]) {
      tiers[tierSlug] = [];
    }
    const sponsor = {
      slug: order.fromAccount.slug,
      name: sponsorAliases[canonicalSlug]?.title ?? order.fromAccount.name,
      imageUrl: order.fromAccount.imageUrl,
      website: order.fromAccount.website,
      amount: order.amount.value,
    };
    if (existingIndex === undefined) {
      seen.set(key, tiers[tierSlug].length);
      tiers[tierSlug].push(sponsor);
    } else {
      tiers[tierSlug][existingIndex] = sponsor;
    }
  }

  // Sort deterministically so a reshuffled API response does not produce a noisy
  // diff when the underlying sponsor set has not actually changed.
  const sorted = {};
  for (const tierSlug of Object.keys(tiers).sort()) {
    sorted[tierSlug] = tiers[tierSlug].sort((a, b) => a.slug.localeCompare(b.slug));
  }

  return sorted;
}

async function main() {
  console.log('Fetching active sponsors from OpenCollective...');

  const orders = await fetchActiveSponsors();
  console.log(`  Found ${orders.length} active subscriptions`);

  const exclusions = JSON.parse(fs.readFileSync(EXCLUSIONS_PATH, 'utf8'));
  const tierOverrides = JSON.parse(fs.readFileSync(TIER_OVERRIDES_PATH, 'utf8'));
  const sponsorAliases = JSON.parse(fs.readFileSync(SPONSOR_ALIASES_PATH, 'utf8'));
  const { included, excluded } = filterExcludedSponsors(orders, exclusions, sponsorAliases);
  for (const { order, reason } of excluded) {
    console.log(`  Excluded ${order.fromAccount.name} (${order.fromAccount.slug}): ${reason}`);
  }

  for (const order of included) {
    const override = tierOverrides[order.fromAccount.slug];
    if (override) {
      console.log(
        `  Tier override for ${order.fromAccount.name} (${order.fromAccount.slug}): `
        + `${order.tier?.slug ?? 'unknown'} -> ${override.tier} (${override.reason})`,
      );
    }
  }

  const tiers = groupByTier(included, tierOverrides, sponsorAliases);

  for (const [tier, sponsors] of Object.entries(tiers)) {
    console.log(`  ${tier}: ${sponsors.length} sponsors`);
  }

  // Only bump lastUpdated when the sponsor data actually changed, so re-running
  // with an unchanged sponsor set leaves the file (and git diff) untouched.
  let lastUpdated = new Date().toISOString();
  if (fs.existsSync(OUTPUT_PATH)) {
    const previous = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
    if (JSON.stringify(previous.tiers) === JSON.stringify(tiers)) {
      lastUpdated = previous.lastUpdated;
      console.log('No sponsor changes; leaving file unchanged.');
    }
  }

  const output = {
    lastUpdated,
    tiers,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`Sponsors saved to ${OUTPUT_PATH}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Failed to fetch sponsors:', error);
    process.exit(1);
  });
}

module.exports = {
  filterExcludedSponsors,
  findExclusion,
  groupByTier,
  resolveCanonicalSlug,
  validateSponsorAliases,
  validateTierOverrides,
};
