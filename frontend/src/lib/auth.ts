import { betterAuth } from "better-auth";

export const myAuth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:8000",
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-for-dev",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 7 * 24 * 60 * 60, // 7 days
    rememberMe: true,
  },
});