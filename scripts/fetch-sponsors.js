#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const OPENCOLLECTIVE_API = 'https://api.opencollective.com/graphql/v2';
const COLLECTIVE_SLUG = 'aurelia';
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'sponsors.json');

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

function groupByTier(orders) {
  const tiers = {};
  const seen = new Set();

  for (const order of orders) {
    const tierSlug = order.tier?.slug || 'unknown';
    const accountSlug = order.fromAccount.slug;

    // Dedupe sponsors who may have multiple active orders
    const key = `${tierSlug}:${accountSlug}`;
    if (seen.has(key)) continue;
    seen.add(key);

    if (!tiers[tierSlug]) {
      tiers[tierSlug] = [];
    }
    tiers[tierSlug].push({
      slug: order.fromAccount.slug,
      name: order.fromAccount.name,
      imageUrl: order.fromAccount.imageUrl,
      website: order.fromAccount.website,
      amount: order.amount.value,
    });
  }

  return tiers;
}

async function main() {
  console.log('Fetching active sponsors from OpenCollective...');

  const orders = await fetchActiveSponsors();
  console.log(`  Found ${orders.length} active subscriptions`);

  const tiers = groupByTier(orders);

  for (const [tier, sponsors] of Object.entries(tiers)) {
    console.log(`  ${tier}: ${sponsors.length} sponsors`);
  }

  const output = {
    lastUpdated: new Date().toISOString(),
    tiers,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`Sponsors saved to ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error('Failed to fetch sponsors:', error);
  process.exit(1);
});
