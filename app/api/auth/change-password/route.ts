import  prisma  from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return new Response('Token and password are required', { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gte: new Date(), // token not expired
      },
    },
  });

  if (!user) {
    return new Response('Invalid or expired token', { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return Response.json({ message: 'Password has been updated' });
}
