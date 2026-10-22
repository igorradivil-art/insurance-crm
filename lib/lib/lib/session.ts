import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "crm_session";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-change-me"
);

export async function createSessionToken(userId: number) {
  return new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<number | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return typeof payload.uid === "number" ? payload.uid : null;
  } catch {
    return null;
  }
}
