'use client';

import { Skeleton } from '@/components/ui/skeleton';
import useBills from '../hooks/useBills';
import useOwes from '../hooks/useOwes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/loading';
import SummaryCardStub from './summaryCardStub';
import UserGuideModal from '@/components/user-guide-modal';
import { USER_GUIDE } from '@/lib/constants/user-guide';

type props = {};

export default function SummaryCard({}: props) {
  const {
    data: loans,
    isSuccess: loansSuccess,
    isPending: isLoansPending,
    error: loansError
  } = useBills();
  const {
    data: debts,
    isSuccess: debtsSuccess,
    isPending: isDebtsPending,
    error: debtsError
  } = useOwes();

  const debtsTotal = debts?.reduce((acc, debt) => acc + debt.amount_owed, 0);
  const loanedTotal = loans?.reduce((acc, loan) => acc + loan.total_owed, 0);
  const loanedTotalOwed = loans?.reduce(
    (acc, loan) => acc + loan.total_owed - loan.sum_paid_back,
    0
  );

  const deadlineCards = debts
    ?.filter((debt) => debt.owed_by !== null)
    .map((debt) => (
      <div
        key={debt.owe_id}
        className="max-sm:flex-col max-sm:text-center flex items-center justify-between py-2 px-4 mb-2 rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col">
          <span className="font-medium">
            {debt.bill_name || <span className="text-muted-foreground">Untitled Debt</span>}
          </span>
          <span className="text-sm text-muted-foreground">Due: {debt.owed_by}</span>
        </div>
        <div className="max-sm:flex-col flex items-center gap-4">
          <span className="text-sm">To: {debt.loaner_name}</span>
          <span className="font-semibold">${debt.amount_owed}</span>
        </div>
      </div>
    ));

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Bills Summary</CardTitle>
        <CardDescription>See your current debts and loans.</CardDescription>
      </CardHeader>
      <CardContent>
        {isDebtsPending || isLoansPending ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="max-sm:flex-col flex gap-6">
              <SummaryCardStub
                title="You Owe"
                number={debtsTotal?.toFixed(2)}
                colour="text-[#f43f5e]"
              />
              <SummaryCardStub
                title="Still Owed"
                number={loanedTotalOwed?.toFixed(2)}
                colour="text-[#10b981]"
              />
            </div>
            {
              <div className="mt-6">
                <CardTitle>Upcoming Debt Deadlines</CardTitle>
                {debtsSuccess && deadlineCards!.length > 0 ? (
                  <div>
                    <ul className="mt-4 max-sm:max-h-[200px] max-sm:overflow-y-auto max-sm:border max-sm:rounded-lg max-sm:p-2">
                      {deadlineCards}
                    </ul>
                  </div>
                ) : (
                  <CardDescription className="mt-2">
                    You have no current debts with deadlines
                  </CardDescription>
                )}
              </div>
            }
          </>
        )}
      </CardContent>
    </Card>
  );
}
