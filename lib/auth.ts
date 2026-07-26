import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "@/lib/db/client";
import { schema } from "@/lib/db/schema";

function vercelOrigin(hostname: string | undefined) {
  if (!hostname) return null;
  return hostname.startsWith("http")
    ? hostname
    : `https://${hostname}`;
}

const trustedOrigins = [
  process.env.BETTER_AUTH_URL,
  vercelOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL),
  vercelOrigin(process.env.VERCEL_URL),
].filter((origin): origin is string => Boolean(origin));

export const auth = betterAuth({
  appName: "IHBA Admin",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins,
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    autoSignIn: true,
    minPasswordLength: 12,
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
  ],
});
