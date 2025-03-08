import { THouse, THouseDB } from '@/app/(main)/house-settings/types';
import { TApiResponse } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const fetchHouse = async (): Promise<THouse | null> => {
  const res = await fetch(`/api/house`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  const json: TApiResponse<THouseDB> = await res.json();

  const jsonData: THouse | null = json.data && {
    id: json.data.id,
    owner: json.data.owner,
    name: json.data.name,
    address: json.data.address,
    chatbotActive: json.data.chatbot_active,
    cameraId: json.data.camera_id
  };

  return jsonData ?? null;
};

export default function useGetHouse() {
  return useQuery({
    queryKey: ['house'],
    queryFn: async () => fetchHouse()
  });
}
