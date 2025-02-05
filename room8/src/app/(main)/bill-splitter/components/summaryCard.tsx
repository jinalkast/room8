'use client';

import { Skeleton } from '@/components/ui/skeleton';
import useBills from '../hooks/useBills';
import useOwes from '../hooks/useOwes';

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
        <li>
          {debt.owed_by} - {debt.bill_name}
        </li>
      );
    });
  console.log(debtDeadlines);
  return (
    <div className="flex flex-row">
      <div className="w-[67%]">
        <div className="mb-4">
          <h2 className="text-3xl">You Owe</h2>
          {isDebtsPending ? (
            <Skeleton className="min-h-[50px] min-w-[100px] max-w-[95%]" />
          ) : debtsSuccess ? (
            <div className="min-h-[50px] bg-green-500 min-w-[100px] max-w-[95%] flex items-center">
              <h4 className="scroll-m-20 text-l font-semibold tracking-tight text-black ml-5">
                ${debtsTotal?.toFixed(2)}
              </h4>
            </div>
          ) : (
            <div>Error</div>
          )}
        </div>
        <div className="mb-4">
          <h2 className="text-3xl">You Recently Gave Out</h2>
          {isLoansPending ? (
            <Skeleton className="min-h-[50px] min-w-[100px] max-w-[95%]" />
          ) : loansSuccess ? (
            <div className="min-h-[50px] bg-blue-500 min-w-[100px] max-w-[95%] flex items-center">
              <h4 className="scroll-m-20 text-l font-semibold tracking-tight text-black ml-5">
                ${loanedTotal?.toFixed(2)}
              </h4>
            </div>
          ) : (
            <div>Error</div>
          )}
          <h3 className="text-1xl">And of that, you are still owed</h3>
          <div>
            {isLoansPending ? (
              <Skeleton className="min-h-[50px] min-w-[100px] max-w-[95%]" />
            ) : loansSuccess ? (
              <div className="min-h-[50px] bg-red-500 min-w-[100px] max-w-[95%] flex items-center">
                <h4 className="scroll-m-20 text-l font-semibold tracking-tight text-black ml-5">
                  ${loanedTotalOwed?.toFixed(2)}
                </h4>
              </div>
            ) : (
              <div>Error</div>
            )}
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-2xl">Debt Deadlines</h3>
        {isDebtsPending ? (
          <>
            <Skeleton className="min-h-[30px] mb-1" />
            <Skeleton className="min-h-[30px] mb-1" />
            <Skeleton className="min-h-[30px] mb-1" />
          </>
        ) : debtsSuccess ? (
          debtDeadlines!.length > 0 ? (
            <ul>{debtDeadlines}</ul>
          ) : (
            <div>No debts with deadlines</div>
          )
        ) : (
          <div>Error</div>
        )}
      </div>
    </div>
  );
}
