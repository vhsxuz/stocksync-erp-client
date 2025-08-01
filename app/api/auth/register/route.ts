import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

const {
  EMAIL_FROM,
  EMAIL_BASE_URL,
  GMAIL_USER,
  GMAIL_PASS
} = process.env;

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return new Response('Email already registered', { status: 400 });

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
      isVerified: false,
      isActive: false
    },
  });

  const verifyLink = `${EMAIL_BASE_URL}/verify?email=${encodeURIComponent(user.email)}`;
  console.log('Verify Link:', verifyLink);

  // ✅ Setup Gmail transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER!,
      pass: GMAIL_PASS!
    }
  });

  const mailOptions = {
    from: EMAIL_FROM!,
    to: email,
    subject: 'Verify Your StockSync ERP Account',
    html: `
      <div style="font-family: sans-serif; padding: 2rem; background: #111827; color: #fff;">
        <h1 style="font-size: 2rem; font-weight: bold; background: linear-gradient(to right, #34D399, #3B82F6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          Welcome to StockSync ERP
        </h1>
        <p style="color: #d1d5db; margin-top: 1rem; font-size: 1rem;">
          Hi ${name || 'there'}, thank you for registering. Please verify your email address to activate your account.
        </p>
        <a href="${verifyLink}" style="
          display: inline-block;
          margin-top: 2rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(to bottom right, #34D399, #3B82F6);
          color: #000;
          font-weight: 600;
          border-radius: 0.75rem;
          text-decoration: none;
        ">
          Verify Account
        </a>
        <p style="margin-top: 2rem; color: #6b7280; font-size: 0.875rem;">
          If you didn't request this, just ignore this email.
        </p>
        <p style="margin-top: 1rem; color: #4b5563; font-size: 0.75rem;">
          &copy; ${new Date().getFullYear()} StockSync ERP
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent via Gmail');
  } catch (err) {
    console.error('❌ Email error:', err);
    return new Response('Failed to send email', { status: 500 });
  }

  return Response.json({ message: 'Registered. Please check your email to verify your account.' });
}