export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("❌ JWT_SECRET no està definit a .env");
  }
  return secret;
}
