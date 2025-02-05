'use client';

import { useState } from 'react';
import { FilePen, House, HandCoins, Receipt, Book, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import CreateBillForm from './components/createBillForm';
import DebtsTable from './components/debtsTable';
import LoansTable from './components/loansTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/modal';
import SummaryCard from './components/summaryCard';
import HistoryTable from './components/historyTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function BillSplitterPage() {
  const [isModelOpen, setIsModelOpen] = useState(false);
  return (
    <div>
      <h2 className="text-4xl mb-8">Bill Splitter</h2>
      <div className="w-[50vw]">
        <SummaryCard />
        <Card>
          <CardHeader>
            <CardTitle>Bill Tracker</CardTitle>
            <CardDescription>View your outstanding debts, loans, and history.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="debts">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="debts">
                    <div className="flex gap-2 items-center">
                      <HandCoins />
                      <p>Outstanding Debts</p>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="loans">
                    <div className="flex gap-2 items-center">
                      <Receipt />
                      <p>Outstanding Loans</p>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="history">
                    <div className="flex gap-2 items-center">
                      <Book />
                      <p>History</p>
                    </div>
                  </TabsTrigger>
                </TabsList>
                <Modal
                  open={isModelOpen}
                  onOpenChange={setIsModelOpen}
                  title={'Create Bill'}
                  trigger={
                    <Button>
                      <Plus />
                      Create Bill
                    </Button>
                  }>
                  <CreateBillForm closeBillModal={() => setIsModelOpen(false)} />
                </Modal>
              </div>
              <TabsContent value="debts">
                <DebtsTable />
              </TabsContent>
              <TabsContent value="loans">
                <LoansTable />
              </TabsContent>
              <TabsContent value="history">
                <HistoryTable />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
