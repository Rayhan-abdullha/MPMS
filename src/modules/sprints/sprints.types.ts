export interface CreateSprintInput {
  title: string;
  startDate: string;
  endDate: string;
  order?: number;
}

export interface UpdateSprintInput {
  title?: string;
  startDate?: string;
  endDate?: string;
  order?: number;
}
