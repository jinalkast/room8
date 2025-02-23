import { InfinitySpin } from 'react-loader-spinner';

export default function LoadingSpinner() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <InfinitySpin width="200" color="#FDBF57" />
    </div>
  );
}
