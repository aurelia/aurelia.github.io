const assert = require('node:assert/strict');
const { test } = require('node:test');
const exclusions = require('../data/sponsor-exclusions.json');
const {
  filterExcludedSponsors,
  findExclusion,
  groupByTier,
  validateSponsorAliases,
  validateTierOverrides,
} = require('./fetch-sponsors');

function createOrder({ slug, name = slug, website = null, tier = 'bronze', amount = 100 }) {
  return {
    amount: { value: amount },
    fromAccount: { slug, name, website },
    tier: { slug: tier },
  };
}

test('excludes a sponsor by exact slug at any tier', () => {
  const order = createOrder({ slug: 'bestpayidpokies', tier: 'platinum' });
  assert.match(findExclusion(order, exclusions), /blocked slug/);
});

test('excludes a sponsor by website domain or subdomain', () => {
  const order = createOrder({
    slug: 'new-account',
    website: 'https://offers.betpokies.com/welcome',
  });
  assert.match(findExclusion(order, exclusions), /blocked domain/);
});

test('excludes a renamed sponsor using a gambling-related term', () => {
  const order = createOrder({
    slug: 'new-account',
    name: 'Example Gambling Magazine',
  });
  assert.match(findExclusion(order, exclusions), /blocked term: gambling/);
});

test('keeps an unrelated sponsor', () => {
  const safeOrder = createOrder({
    slug: 'example-software',
    name: 'Example Software Company',
    website: 'https://example.com',
  });
  const result = filterExcludedSponsors([safeOrder], exclusions);
  assert.deepEqual(result.included, [safeOrder]);
  assert.deepEqual(result.excluded, []);
});

test('places an approved lower-value sponsor in its overridden tier', () => {
  const order = createOrder({ slug: 'approved-exception', tier: 'wood', amount: 30 });
  const tiers = groupByTier([order], {
    'approved-exception': {
      tier: 'bronze',
      reason: 'Approved $30/month exception',
    },
  });

  assert.equal(tiers.bronze[0].slug, 'approved-exception');
  assert.equal(tiers.bronze[0].amount, 30);
  assert.equal(tiers.wood, undefined);
});

test('rejects invalid or undocumented tier overrides', () => {
  assert.throws(
    () => validateTierOverrides({ example: { tier: 'diamond', reason: 'Not a displayed tier' } }),
    /Invalid tier override/,
  );
  assert.throws(
    () => validateTierOverrides({ example: { tier: 'bronze' } }),
    /must include a reason/,
  );
});

test('does not let a tier override bypass an exclusion', () => {
  const blockedOrder = createOrder({ slug: 'bestpayidpokies', tier: 'wood', amount: 30 });
  const { included } = filterExcludedSponsors([blockedOrder], exclusions);
  const tiers = groupByTier(included, {
    bestpayidpokies: {
      tier: 'bronze',
      reason: 'This must not bypass the exclusion policy',
    },
  });

  assert.deepEqual(tiers, {});
});

test('merges manually aliased accounts and prefers the canonical profile', () => {
  const vietnam = createOrder({ slug: 'jbo-vietnam', name: 'JBO Vietnam' });
  const thailand = createOrder({ slug: 'jbo-thailand', name: 'JBO Thailand' });
  const tiers = groupByTier(
    [vietnam, thailand],
    {},
    {
      'jbo-thailand': {
        aliases: ['jbo-vietnam'],
        title: 'JBO',
      },
    },
  );

  assert.equal(tiers.bronze.length, 1);
  assert.equal(tiers.bronze[0].slug, 'jbo-thailand');
  assert.equal(tiers.bronze[0].name, 'JBO');
});

test('applies canonical exclusions to sponsor aliases', () => {
  const alias = createOrder({ slug: 'jbo-vietnam', name: 'Neutral regional name' });
  const result = filterExcludedSponsors(
    [alias],
    { blockedSlugs: ['jbo-thailand'], blockedDomains: [], blockedTerms: [] },
    { 'jbo-thailand': { aliases: ['jbo-vietnam'], title: 'JBO' } },
  );

  assert.deepEqual(result.included, []);
  assert.equal(result.excluded.length, 1);
});

test('rejects sponsor slugs assigned to multiple alias groups', () => {
  assert.throws(
    () => validateSponsorAliases({
      first: { aliases: ['shared'] },
      second: { aliases: ['shared'] },
    }),
    /multiple alias groups/,
  );
});
