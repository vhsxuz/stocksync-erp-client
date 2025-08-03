// app/dashboard/layout.tsx
import DashboardLayout from '@/app/layouts/dashboard';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
