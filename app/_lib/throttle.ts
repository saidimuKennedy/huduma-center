import "server-only";

// Best-effort in-memory attempt throttle to slow ID/OTP enumeration.
// Demo-grade only: per-instance memory, resets on redeploy. For production use a
// shared store (Redis/Upstash) keyed the same way.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export interface ThrottleResult {
	allowed: boolean;
	retryAfterSeconds: number;
}

export function checkRateLimit(
	key: string,
	max: number,
	windowSeconds: number,
): ThrottleResult {
	const now = Date.now();
	const bucket = buckets.get(key);

	if (!bucket || now > bucket.resetAt) {
		buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
		return { allowed: true, retryAfterSeconds: 0 };
	}

	if (bucket.count >= max) {
		return {
			allowed: false,
			retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
		};
	}

	bucket.count += 1;
	return { allowed: true, retryAfterSeconds: 0 };
}
