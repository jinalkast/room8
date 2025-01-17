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
    <div className="min-h-screen flex">
      <div className="basis-[400px]">
        <Menu />
      </div>
      <div className="flex-1 mt-[70px] mr-[60px]">{children}</div>
    </div>
  );
}
