import { Json } from "@/lib/types/supabase";
import { useMutation } from "@tanstack/react-query";

export const activateChatbot = async (): Promise<Json | null> => {
  const res = await fetch(`/api/chatbot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "test" }),
  });

  const json = await res.json();

  return json ?? null;
};

export default function useActivateChatbot() {

    return useMutation({
        mutationFn: () => {
            return activateChatbot();
        },
    });
}