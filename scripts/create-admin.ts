/**
 * Create (or promote) an IHBA admin account.
 *
 * Sign-up is disabled in `lib/auth.ts`, so admins cannot be created from the
 * login screen — they have to be written server-side. `scripts/seed.ts` does
 * that for one hardcoded demo account; this script is the reusable version for
 * real staff.
 *
 *   npm run admin:create -- --email ayse@ihba.org --name "Ayşe Yılmaz"
 *   npm run admin:create -- --email ayse@ihba.org --name "Ayşe Yılmaz" --password "..."
 *   npm run admin:create -- --email ayse@ihba.org --reset-password
 *
 * With no --password a strong one is generated and printed once. Existing
 * users are promoted to admin rather than duplicated; their password is only
 * touched when --reset-password is passed.
 */
import { randomBytes, randomUUID } from "crypto";
import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import { db } from "../lib/db/client";
import { account, user } from "../lib/db/schema";

/** Mirrors `emailAndPassword.minPasswordLength` in lib/auth.ts. */
const MIN_PASSWORD_LENGTH = 12;

function parseArgs(argv: string[]) {
  const flags: Record<string, string | boolean> = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      flags[key] = true;
      continue;
    }
    flags[key] = next;
    index += 1;
  }
  return flags;
}

function readString(value: string | boolean | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

/** Ambiguity-free alphabet — no l/I/1 or O/0 to misread when handing it over. */
function generatePassword(length = 20) {
  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#%*-_=+";
  const bytes = randomBytes(length);
  let password = "";
  for (let index = 0; index < length; index += 1) {
    password += alphabet[bytes[index] % alphabet.length];
  }
  return password;
}

function fail(message: string): never {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  const email = readString(flags.email).toLowerCase();
  const name = readString(flags.name);
  const providedPassword = readString(flags.password);
  const resetPassword = flags["reset-password"] === true;

  if (!email || !email.includes("@")) {
    fail('A valid --email is required, e.g. --email ayse@ihba.org');
  }
  if (providedPassword && providedPassword.length < MIN_PASSWORD_LENGTH) {
    fail(`--password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  const existing = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  const now = new Date();

  if (existing) {
    await db
      .update(user)
      .set({
        role: "admin",
        emailVerified: true,
        banned: false,
        ...(name ? { name } : {}),
        updatedAt: now,
      })
      .where(eq(user.id, existing.id));

    if (!providedPassword && !resetPassword) {
      console.log(`\n✓ ${email} already existed — promoted to admin.`);
      console.log("  Password left unchanged. Pass --reset-password to set a new one.\n");
      return;
    }

    const password = providedPassword || generatePassword();
    const hashed = await hashPassword(password);
    const credential = await db.query.account.findFirst({
      where: eq(account.userId, existing.id),
    });

    if (credential) {
      await db
        .update(account)
        .set({ password: hashed, updatedAt: now })
        .where(eq(account.id, credential.id));
    } else {
      await db.insert(account).values({
        id: randomUUID(),
        accountId: existing.id,
        providerId: "credential",
        userId: existing.id,
        password: hashed,
        createdAt: now,
        updatedAt: now,
      });
    }

    console.log(`\n✓ ${email} promoted to admin and password reset.`);
    if (!providedPassword) console.log(`  Temporary password: ${password}`);
    console.log("  Ask them to change it under /admin/account after signing in.\n");
    return;
  }

  if (!name) {
    fail('A --name is required for a new account, e.g. --name "Ayşe Yılmaz"');
  }

  const password = providedPassword || generatePassword();
  const id = randomUUID();

  await db.insert(user).values({
    id,
    email,
    name,
    emailVerified: true,
    role: "admin",
    createdAt: now,
    updatedAt: now,
  });
  await db.insert(account).values({
    id: randomUUID(),
    accountId: id,
    providerId: "credential",
    userId: id,
    password: await hashPassword(password),
    createdAt: now,
    updatedAt: now,
  });

  console.log(`\n✓ Admin created: ${name} <${email}>`);
  if (!providedPassword) console.log(`  Temporary password: ${password}`);
  console.log("  Sign in at /admin/login, then change it under /admin/account.\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
