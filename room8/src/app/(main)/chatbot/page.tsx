'use client'

import { Button } from '@/components/ui/button';
import useActivateChatbot from '@/hooks/useActivateChatbot';

export default function ChatBotPage() {
  const activate = useActivateChatbot();
  return (
    <div className="grid place-content-center min-h-screen">
      <Button onClick={() => activate.mutate()}>Activate Chatbot</Button>
    </div>
  );
}
