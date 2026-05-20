import { ProjectStatus, UserRole } from '@prisma/client';

export interface CreateProjectInput {
  title: string;
  client: string;
  description?: string;
  startDate: string;
  endDate?: string;
  budget?: number;
  thumbnail?: string;
  status?: ProjectStatus;
}

export interface UpdateProjectInput {
  title?: string;
  client?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  thumbnail?: string;
  status?: ProjectStatus;
}

export interface ProjectQueryParams {
  status?: ProjectStatus;
  client?: string;
  search?: string;
  page?: string;
  limit?: string;
}

export interface PaginatedProjectsResponse {
  results: number;
  meta: {
    total: number;
    page: number;
    pages: number;
  };
  projects: any[]; // Matches the structural layout returned from dynamic prisma queries
}
