import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const prisma = new PrismaClient();

const { GMAIL_USER, GMAIL_PASS, EMAIL_FROM, EMAIL_BASE_URL } = process.env;

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return new Response('Email not found', { status: 404 });
  }

  // generate token
  const token = crypto.randomBytes(32).toString('hex');

  // save token in user table
  await prisma.user.update({
    where: { email },
    data: {
      resetToken: token,
      resetTokenExpiry: new Date(Date.now() + 1000 * 60 * 60), // 1 hour expiry
    },
  });

  const resetLink = `${EMAIL_BASE_URL}/auth/change-password?token=${token}`;

  // Gmail transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
  });

  // Styled email
  const html = `
    <div style="font-family: 'Inter', sans-serif; background-color: #111827; padding: 40px; color: #ffffff;">
      <div style="max-width: 600px; margin: auto; background-color: #1f2937; border-radius: 16px; padding: 32px;">
        <h1 style="font-size: 26px; font-weight: bold; margin-bottom: 16px; background: linear-gradient(to right, #34D399, #3B82F6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          Reset Your Password
        </h1>

        <p style="font-size: 15px; color: #d1d5db; margin-bottom: 24px;">
          Hi ${user.name || 'there'},<br/>
          We received a request to reset your password. Click the button below to continue.
        </p>

        <div style="text-align: center; margin-bottom: 32px;">
          <a href="${resetLink}" style="
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(to bottom right, #34D399, #3B82F6);
            color: #000000;
            font-weight: 600;
            border-radius: 12px;
            text-decoration: none;
          ">
            Reset Password
          </a>
        </div>

        <p style="font-size: 13px; color: #9ca3af;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>

        <p style="font-size: 12px; color: #6b7280; margin-top: 24px; text-align: center;">
          &copy; ${new Date().getFullYear()} StockSync ERP. All rights reserved.
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: EMAIL_FROM!,
      to: email,
      subject: 'Reset your StockSync ERP password',
      html,
    });

    return Response.json({ message: 'Reset link sent' });
  } catch (err) {
    console.error('❌ Failed to send reset email:', err);
    return new Response('Email failed', { status: 500 });
  }
}
