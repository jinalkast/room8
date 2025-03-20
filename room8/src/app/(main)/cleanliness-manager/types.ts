export type TCleanlinessTask = {
  id: number;
  created_at: string;
  name: string;
  cl_log_id: string;
  assigned_to_id: string;
  assigned_by_id: string;
  status: TTaskStatus;
  assigned_by: {
    id: string;
    name: string;
    image_url: string | null;
  };
  assigned_to: {
    id: string;
    name: string;
    image_url: string | null;
  };
  completed_by: {
    id: string;
    name: string;
    image_url: string | null;
  };
  cleanliness_log: {
    id: string;
    house_id: string;
    created_at: string;
    after_image_url: string;
    before_image_url: string;
  };
};

export type TTaskStatus = 'unassigned' | 'pending' | 'completed' | 'dismissed';
export type TSortBy = 'Date (newest)' | 'Date (oldest)' | 'Status priority';
export type TQuickFilter = 'all' | 'yours' | 'pending' | 'history';
