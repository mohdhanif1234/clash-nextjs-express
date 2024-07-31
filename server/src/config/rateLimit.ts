import rateLimit from "express-rate-limit";

export const appLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 60 minutes
	limit: 100, 
	standardHeaders: 'draft-7', 
	legacyHeaders: false,
})

export const authLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 60 minutes
	limit: 130, 
	standardHeaders: 'draft-7', 
	legacyHeaders: false,
})