'use client';

import { useState } from 'react';
import { FilePen, House, HandCoins, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';
import CreateBillForm from './components/createBillForm';
import OwesTable from './components/owesTable';
import BillsTable from './components/billsTable';
import { Card } from '@/components/ui/card';

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
    // summary: { icon: <House />, title: 'Summary', component: <div>Summary</div> },
    create: {
      icon: <FilePen />,
      title: 'Create Bill',
      component: <CreateBillForm />
    },
    owes: {
      icon: <HandCoins />,
      title: 'Outstanding Debts',
      component: <OwesTable />
    },
    loans: {
      icon: <Receipt />,
      title: 'Outstanding Loans',
      component: <BillsTable />
    }
  };

  const [activeTab, setActiveTab] = useState(TABS.create);
  return (
    <div>
      <h2 className="text-4xl mb-8">Bill Splitter</h2>

      <Card className="p-8">
        <nav className={cn('flex justify-center gap-6 ')}>
          {Object.values(TABS).map((tab) => (
            <div
              key={tab.title}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex gap-3 cursor-pointer hover:bg-[#955363] p-2 rounded-md transition-all mb-4',
                {
                  'bg-[#490024]': activeTab.title === tab.title
                }
              )}>
              {tab.icon}
              <div className="hidden lg:block">{tab.title}</div>
            </div>
          ))}
        </nav>
        {activeTab.component}
      </Card>
    </div>
  );
}
