'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import useActivateChatbot from '@/hooks/useActivateChatbot';
import useRoommates from '@/hooks/useRoommates';
import Image from 'next/image';

export default function ChatBotPage() {
  const activate = useActivateChatbot();
  const { data: roommates, isLoading } = useRoommates();

  return (
    <div>
      <h2 className="text-4xl">ChatBot Integration</h2>

      <Card className="mt-8 w-[600px]">
        <CardHeader>
          <CardTitle>Activate ChatBot</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This ChatBot will send all the following roommates SMS notifcations regarding the state
            of the household:
          </p>
          {roommates && (
            <ul className="grid grid-cols-2 gap-4">
              {roommates.map((roommate) => (
                <li key={roommate.id} className="flex gap-4 items-center">
                  <Image
                    src={roommate.image_url}
                    alt={roommate.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p>{roommate.name}</p>
                    <p className="text-sm text-muted-foreground">{roommate.phone}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        <CardFooter>
          <Button className="mt-4 w-full" onClick={() => activate.mutate()}>
            Activate Chatbot
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
