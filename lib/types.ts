// lib/types.ts
import type { Tables } from './database.types';

// This file will be the single source of truth for our complex data shapes.

export type TaskWithStatus = Tables<'tasks'> & {
  status: string;
};

export type StepWithDetails = Tables<'steps'> & {
  tasks: TaskWithStatus[];
  guidance_content?: Tables<'guidance_content'> | null;
  status?: string;
};

export type StageWithDetails = Tables<'stages'> & {
  status: string;
  steps: StepWithDetails[];
};

export type JourneyWorkspaceData = Tables<'journey_templates'> & {
  userJourneyId: string;
  stages: StageWithDetails[];
};

export type JourneyData = Tables<'journey_templates'> & {
  stages: StageWithDetails[];
};
