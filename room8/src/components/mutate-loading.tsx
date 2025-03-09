import LoadingSpinner from './loading';

type props = {
  condition: boolean;
};

function MutateLoadingSpinner({ condition }: props) {
  return (
    condition && (
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-screen h-screen bg-background/50 cursor-wait">
        <LoadingSpinner />
      </div>
    )
  );
}

export default MutateLoadingSpinner;
