import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BotMessageSquare, CalendarCheck, HousePlus, Receipt, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardCards() {
  const PAGES = [
    {
      name: 'Bill Splitter',
      icon: <Receipt size={54} strokeWidth={1} />,
      link: '/bill-splitter'
    },
    {
      name: 'Chore Schedule',
      icon: <CalendarCheck size={54} strokeWidth={1} />,
      link: '/schedule'
    },
    {
      name: 'ChatBot',
      icon: <BotMessageSquare size={54} strokeWidth={1} />,
      link: '/chatbot'
    },
    {
      name: 'My House',
      icon: <HousePlus size={54} strokeWidth={1} />,
      link: '/house-settings'
    },
    {
      name: 'Settings',
      icon: <Settings size={54} strokeWidth={1} />,
      link: '/settings'
    }
  ];

  const router = useRouter();

  return (
    <div className="flex gap-4 mb-6">
      {PAGES.map((page) => (
        <div
          onClick={() => router.push(page.link)}
          key={page.name}
          className="cursor-pointer transition-all hover:bg-primary/10 border rounded-lg grid place-content-center w-36 h-36 text-center">
          <div className="flex justify-center mb-2">{page.icon}</div>
          <p>{page.name}</p>
        </div>
      ))}
    </div>
  );
}
