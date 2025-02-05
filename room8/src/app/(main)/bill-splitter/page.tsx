'use client';

import { useState } from 'react';
import { FilePen, House, HandCoins, Receipt, Book } from 'lucide-react';
import { cn } from '@/lib/utils';
import CreateBillForm from './components/createBillForm';
import DebtsTable from './components/debtsTable';
import LoansTable from './components/loansTable';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/modal';
import { DialogClose } from '@/components/ui/dialog';
import SummaryCard from './components/summaryCard';
import HistoryTable from './components/historyTable';

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
    summary: {
      icon: <House />,
      title: 'Summary',
      component: <SummaryCard />
    },
    // create: {
    //   icon: <FilePen />,
    //   title: 'Create Bill',
    //   component: <CreateBillForm />
    // },
    owes: {
      icon: <HandCoins />,
      title: 'Outstanding Debts',
      component: <DebtsTable />
    },
    loans: {
      icon: <Receipt />,
      title: 'Outstanding Loans',
      component: <LoansTable />
    },
    history: {
      icon: <Book />,
      title: 'History',
      component: <HistoryTable />
    }
  };

  const [activeTab, setActiveTab] = useState(TABS.summary);
  const [isModelOpen, setIsModelOpen] = useState(false);
  return (
    <div>
      <h2 className="text-4xl mb-8">Bill Splitter</h2>

      <Card className="p-8">
        <nav className={cn('flex justify-between gap-6 border-b mb-2')}>
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
        <main className="max-h-[500px] overflow-y-auto">{activeTab.component}</main>
        <div className="w-full">
          <Modal
            open={isModelOpen}
            onOpenChange={setIsModelOpen}
            title={'Create Bill'}
            trigger={<Button className="w-full">Create Bill</Button>}>
            <CreateBillForm closeBillModal={() => setIsModelOpen(false)} />
          </Modal>
        </div>
      </Card>
    </div>
  );
}
