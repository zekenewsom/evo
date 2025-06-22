// lib/types.ts
import type { Tables } from './database.types';

// This file will be the single source of truth for our complex data shapes.

export type TaskWithStatus = Tables<'tasks'> & {
  status: string;
};

export type StepWithDetails = Tables<'steps'> & {
  status: string;
  tasks: TaskWithStatus[];
  guidance_content: Tables<'guidance_content'> | null;
};

export type StageWithDetails = Tables<'stages'> & {
  status: string;
  steps: StepWithDetails[];
};

export type JourneyData = Tables<'journey_templates'> & {
  stages: StageWithDetails[];
};
