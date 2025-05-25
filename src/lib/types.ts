import { Goal, User, GoalStatus, Priority } from "@prisma/client";

export type GoalWithUser = Goal & {
  user: Pick<User, "id" | "name" | "email">;
};

export type CreateGoalData = {
  title: string;
  description?: string;
  userId: string;
  priority?: Priority;
  dueDate?: string;
};

export type UpdateGoalData = {
  title?: string;
  description?: string;
  status?: GoalStatus;
  priority?: Priority;
  dueDate?: string;
};

export const goalStatusLabels: Record<GoalStatus, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const priorityLabels: Record<Priority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

export const goalStatusColors: Record<GoalStatus, string> = {
  NOT_STARTED: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export const priorityColors: Record<Priority, string> = {
  LOW: "bg-gray-100 text-gray-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  CRITICAL: "bg-red-100 text-red-800",
};

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function isOverdue(dueDate: Date | string | null): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}
