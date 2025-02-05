'use client';

import { Skeleton } from '@/components/ui/skeleton';
import useBills from '../hooks/useBills';
import useOwes from '../hooks/useOwes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/loading';
import SummaryCardStub from './summaryCardStub';

export default function SummaryCard() {
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

  const debtDeadlines = debts
    ?.filter((debt) => debt.owed_by !== null)
    .map((debt) => {
      return (
        <li key={debt.bill_id}>
          {debt.owed_by} - {debt.bill_name}
        </li>
      );
    });

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Summary</CardTitle>
        <CardDescription>See your current debts and loans.</CardDescription>
      </CardHeader>
      <CardContent>
        {isDebtsPending || isLoansPending ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="flex gap-6 mb-6">
              <SummaryCardStub title="You Owe" number={debtsTotal?.toFixed(2)} />
              <SummaryCardStub title="Gave Out" number={loanedTotal?.toFixed(2)} />
              <SummaryCardStub title="Still Owed" number={loanedTotalOwed?.toFixed(2)} />
            </div>
            <div>
              <CardTitle>Upcoming Debt Deadlines</CardTitle>
              {debtsSuccess && debtDeadlines!.length > 0 ? (
                <ul>{debtDeadlines}</ul>
              ) : (
                <CardDescription className="mt-2">
                  You have no current debts with deadlines
                </CardDescription>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
