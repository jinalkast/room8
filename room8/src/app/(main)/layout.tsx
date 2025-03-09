import Menu from '@/components/menu';
import { supabaseServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await supabaseServer();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex gap-6">
      <div className="basis-[280px]">
        <Menu />
      </div>
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
