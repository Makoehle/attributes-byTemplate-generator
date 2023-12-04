export const RATE_LIMIT_REMAINING = "ratelimit-remaining";
export const RATE_LIMIT = 600;

/**
 * We need at least that much of requests to fullfill 1 round trip for worst case.
 * This includes: search for projectIds, create attributes, groups etc
 */

export const MIN_REQUESTS = RATE_LIMIT - 20;
