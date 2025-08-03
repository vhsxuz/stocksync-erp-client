// lib/auth.ts
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function verifyJWT(token: string): Promise<{ id: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      id: payload.id as string,
      email: payload.email as string,
    };
  } catch (err) {
    console.error('❌ JWT Verification Failed:', (err as Error).message);
    return null;
  }
}
