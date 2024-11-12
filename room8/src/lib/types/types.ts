export type TRoommate = {
  id: string;
  name: string;
  image_url: string;
};

export type TOwe = {
  amount_owed: number;
  bill_id: string;
  bill_name: string;
  bill_total: number;
  debtor_id: string;
  debtor_name: string;
  loaner_id: string;
  loaner_name: string;
  owe_id: string;
  owed_by: string;
  paid: boolean;
};
