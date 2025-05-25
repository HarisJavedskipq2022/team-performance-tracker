export interface Goal {
  id: string;
  title: string;
  description?: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "EMPLOYEE" | "MANAGER" | "HR_MANAGER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGoalInput {
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  dueDate?: string;
  userId: string;
}

export interface UpdateGoalInput {
  title?: string;
  description?: string;
  status?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  dueDate?: string;
}

export interface GoalFilters {
  status?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  userId?: string;
}
