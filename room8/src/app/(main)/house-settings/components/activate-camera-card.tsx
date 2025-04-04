import LoadingSpinner from '@/components/loading';
import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import useGetHouse from '@/hooks/useGetHouse';
import { Result } from '@zxing/library';
import { Camera } from 'lucide-react';
import { useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import useEditCamera from '../hooks/useEditCamera';

function ActivateCameraCard() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isManualInputOpen, setIsManualInputOpen] = useState(false);
  const [manualInput, setManualInput] = useState<string>('');
  const [stopStream, setStopStream] = useState(false);
  const { mutate: editCamera, isPending: isEditCameraPending } = useEditCamera();
  const { data: house, isLoading: houseLoading, isError: houseError } = useGetHouse();

  const handleScan = (err: any, data?: Result) => {
    if (data && house) {
      editCamera({ cameraId: data.getText(), houseId: house.id });
      setStopStream(true);
      setTimeout(() => setStopStream(true), 0);
      setIsScannerOpen(false);
    }
    // For some reason this library throws an error when no QR code is found
    // if (err) {
    //   console.error(err);
    //   toast({
    //     title: 'Error!',
    //     description: "Something went wrong scanning your code"
    //   });;
    // }
  };

  const handleManualSubmit = () => {
    if (manualInput && house) {
      editCamera({ cameraId: manualInput, houseId: house.id });
    }
  };

  if (houseLoading) return <LoadingSpinner />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Camera System </CardTitle>
        {house?.cameraId && (
          <CardDescription>
            Your Camera ID is <span className="text-macAccent">{house.cameraId}</span>
          </CardDescription>
        )}
        {house?.cameraId === null && (
          <CardDescription>
            You do not have a Camera Setup. Let&apos;s get you started
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex gap-2">
        <Modal
          open={isScannerOpen}
          onOpenChange={(isScannerOpen) => {
            setStopStream(!isScannerOpen);
            if (!isScannerOpen) {
              // Need a 1 tick delay when unmounting component due to the way the library works
              setTimeout(() => setStopStream(true), 0);
            }
            setIsScannerOpen(isScannerOpen);
          }}
          key={'QR Code Modal'}
          title={`Scan a QR Code to connect your Camera`}
          trigger={
            <Button disabled={isEditCameraPending} variant={'default'}>
              {'Scan QR Code'}
              <Camera className="!h-6 !w-6" />
            </Button>
          }>
          <BarcodeScannerComponent
            stopStream={stopStream}
            width={500}
            height={500}
            onUpdate={handleScan}
          />
        </Modal>
        <Modal
          open={isManualInputOpen}
          onOpenChange={(isManualInputOpen) => {
            if (!isManualInputOpen) {
              // Reset when closing modal
              setManualInput('');
            }
            setIsManualInputOpen(isManualInputOpen);
          }}
          key={'Enter New Camera ID'}
          title={`Enter Camera ID`}
          trigger={
            <Button disabled={isEditCameraPending} variant={'default'}>
              {'Enter CameraID Manually'}
            </Button>
          }>
          <div className="flex flex-col gap-2">
            <Input
              placeholder="your camera id"
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}></Input>
            <Button disabled={isEditCameraPending} className="w-full" onClick={handleManualSubmit}>
              Submit
            </Button>
          </div>
        </Modal>
      </CardContent>
    </Card>
  );
}

export default ActivateCameraCard;
