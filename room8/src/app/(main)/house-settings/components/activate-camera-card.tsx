import LoadingSpinner from '@/components/loading';
import useGetHouse from '@/hooks/useGetHouse';
import { Camera } from 'lucide-react';
import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Result } from "@zxing/library";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { useToast } from '@/hooks/useToast';
import useEditCamera from '../hooks/useEditCamera';

function ActivateCameraCard() {
  const [ isOpen, setIsOpen ] = useState(false);
  const [ stopStream, setStopStream ] = useState(false);
  const { mutate: editCamera, isPending: isEditCameraPending } = useEditCamera();
  const { data: house, isLoading: houseLoading, isError: houseError } = useGetHouse();

  const handleScan = (err: any, data?: Result) => {
    if (data && house) {
      editCamera({ cameraId: data.getText(), houseId: house.id });
      setStopStream(true);
      setTimeout(() => setStopStream(true), 0);
      setIsOpen(false);
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

  if (houseLoading) return <LoadingSpinner />;

  return (
    <Card >
      <CardHeader>
        <CardTitle>Camera System</CardTitle>
        {house?.cameraId && (
          <CardDescription>
            Your Camera ID is <span className="text-macAccent">{house.cameraId}</span>
          </CardDescription>
        )}
        {house?.cameraId === null && (
          <CardDescription>You do not have a Camera Setup. Let's get you started</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Modal
          open={isOpen}
          onOpenChange={(isOpen) => {
            setStopStream(!isOpen)
            if (!isOpen) {
              // Need a 1 tick delay when unmounting component due to the way the library works
              setTimeout(() => setStopStream(true), 0);
            } 
            setIsOpen(isOpen);
          }}
          key={'QR Code Modal'}
          title={`Scan a QR Code to connect your Camera`}
          trigger={
            <Button disabled={isEditCameraPending} variant={'default'}>
              {house?.cameraId === null ? 'Activate Here' : 'Update Here'}
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
      </CardContent>
    </Card>
  );
}

export default ActivateCameraCard;
