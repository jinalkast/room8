import { Json } from "@/lib/types/supabase";
import { useMutation } from "@tanstack/react-query";
import useUser from "./useUser";
import useRoommates from "./useRoommates";

export const activateChatbot = async (user: any, roommates: Array<{ phone: string }> | null): Promise<Json | null> => {
    const phoneList = roommates ? roommates.map((roommate) => roommate.phone).filter(phone => phone != "NULL") : [];
    if (user.phone != "NULL") {
        phoneList.push(user.phone);
    }
    const res = await fetch(`/api/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participants: phoneList }),
    });

    const json = await res.json();
    return json ?? null;
};

export default function useActivateChatbot() {
    const { data: user, status: userStatus } = useUser();
    const { data: roommates, status: roommatesStatus } = useRoommates();

    return useMutation({
        mutationFn: () => {
            if (userStatus !== "success") {
                throw new Error("Error getting user");
            }
            if (roommatesStatus !== "success") {
                throw new Error("Error getting roommates");
            }
            return activateChatbot(user, roommates);
        },
    });
}