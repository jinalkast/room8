import { TActivity, TActivityAndResponsibleDB } from './types';

export const DBtoClientActivities = (activity: TActivityAndResponsibleDB): TActivity => {
  return {
    id: activity.id,
    title: activity.title,
    description: activity.description,
    createdAt: activity.created_at,
    time: activity.time,
    houseId: activity.house_id,
    responsible: activity.responsible
  };
};
