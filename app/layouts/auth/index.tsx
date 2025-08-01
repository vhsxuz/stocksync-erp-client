// src/components/Auth.tsx
'use client';

import Image from 'next/image';
import authImage from '@/assets/images/auth-image.jpg';
import RegisterForm from '@/components/RegisterForm';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';
import LoginForm from '@/components/LoginForm';
import ChangePasswordForm from '@/components/ChangePasswordForm';

type Props = { mode: 'login' | 'register' | 'forgot' | 'change-password' };

export default function Auth({ mode }: Props) {
  return (
    <main className="relative flex min-h-screen items-center justify-center">
      {/* GLOBAL BACKGROUND */}
      <Image
        src={authImage}
        alt="Colorful waves"
        fill
        priority
        className="object-cover -z-10"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/40 -z-10" />

      {/* STATIC‑SIZE CARD */}
      <section
        className="
          flex
          h-[680px] w-[1120px]
          max-w-full max-h-full
          overflow-hidden rounded-[32px]
          border border-white/80 bg-white/10 shadow-2xl
        "
      >
        {/* left column */}
        <div className="hidden w-1/2 flex-col justify-between p-10 text-white md:flex">
          <p className="mb-8 text-xs tracking-[0.3em] uppercase font-medium">
            LEARN • MAP • SCALE
          </p>

          <h2 className="mt-auto font-thin text-6xl leading-none">
            <span className="block">Manage</span>
            <span className="block">Your</span>
            <span className="block">Inventories</span>
          </h2>

          <p className="mt-6 max-w-[18rem] text-sm text-white/80">
            Manage your items with stocksync and improve your productivity
          </p>
        </div>

        {/* right column */}
        <div className="flex w-full flex-col items-center justify-center bg-white px-8 py-16 md:w-1/2 md:px-14">
            {mode === 'register' ? (
            <RegisterForm />
            ) : mode === 'forgot' ? (
            <ForgotPasswordForm />
            ) : mode === 'change-password' ? (
            <ChangePasswordForm />
            ) : (
            <LoginForm />
            )}
        </div>
      </section>
    </main>
  );
}
