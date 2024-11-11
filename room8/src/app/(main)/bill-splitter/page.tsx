'use client';

import { useState } from 'react';
import { FilePen, House, HandCoins, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';
import CreateBillForm from './components/createBillForm';

type Tab = {
  icon: JSX.Element;
  title: string;
  component: JSX.Element;
};

type Tabs = {
  [key: string]: Tab;
};

export default function BillSplitterPage() {
  const TABS: Tabs = {
    summary: { icon: <House />, title: 'Summary', component: <div>Summary</div> },
    create: {
      icon: <FilePen />,
      title: 'Create Bill',
      component: <CreateBillForm />
    },
    outstanding: {
      icon: <HandCoins />,
      title: 'Outstanding Bills',
      component: <div>Outstanding</div>
    },
    pending: {
      icon: <Receipt />,
      title: 'Pending Bills',
      component: <div>Pending</div>
    }
  };

  const [activeTab, setActiveTab] = useState(TABS.summary);
  return (
    <div>
      <nav className={cn('flex justify-center gap-6 ')}>
        {Object.values(TABS).map((tab) => (
          <div
            key={tab.title}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex gap-3 cursor-pointer hover:bg-[#955363] p-2 rounded-md transition-all',
              {
                'bg-[#490024]': activeTab.title === tab.title
              }
            )}>
            {tab.icon}
            {tab.title}
          </div>
        ))}
      </nav>
      <hr />
      {activeTab.component}
    </div>
  );
}
