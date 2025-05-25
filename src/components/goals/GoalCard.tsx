import {
  GoalWithUser,
  formatDate,
  goalStatusColors,
  goalStatusLabels,
  isOverdue,
  priorityColors,
  priorityLabels,
} from "@/lib/types";
import { GoalStatus } from "@prisma/client";
import { AlertCircle, Calendar, User } from "lucide-react";
import Link from "next/link";

interface GoalCardProps {
  goal: GoalWithUser;
  onStatusChange: (goalId: string, newStatus: GoalStatus) => void;
}

export default function GoalCard({ goal, onStatusChange }: GoalCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
            {goal.title}
          </h3>
          <div className="flex space-x-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                priorityColors[goal.priority]
              }`}
            >
              {priorityLabels[goal.priority]}
            </span>
          </div>
        </div>

        {goal.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {goal.description}
          </p>
        )}

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <User className="mr-1 h-4 w-4" />
          {goal.user.name}
        </div>

        {goal.dueDate && (
          <div
            className={`flex items-center text-sm mb-4 ${
              isOverdue(goal.dueDate) && goal.status !== "COMPLETED"
                ? "text-red-600"
                : "text-gray-500"
            }`}
          >
            <Calendar className="mr-1 h-4 w-4" />
            Due {formatDate(goal.dueDate)}
            {isOverdue(goal.dueDate) && goal.status !== "COMPLETED" && (
              <AlertCircle className="ml-1 h-4 w-4" />
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <select
            value={goal.status}
            onChange={(e) =>
              onStatusChange(goal.id, e.target.value as GoalStatus)
            }
            className={`text-xs font-medium rounded-full px-3 py-1.5 border-2 cursor-pointer transition-all duration-200 hover:shadow-sm ${
              goalStatusColors[goal.status]
            }`}
            style={{
              backgroundColor: "white",
              color:
                goal.status === "COMPLETED"
                  ? "#065f46"
                  : goal.status === "IN_PROGRESS"
                  ? "#1e40af"
                  : goal.status === "CANCELLED"
                  ? "#dc2626"
                  : "#374151",
            }}
          >
            {Object.entries(goalStatusLabels).map(([value, label]) => (
              <option
                key={value}
                value={value}
                className="text-gray-900 bg-white"
              >
                {label}
              </option>
            ))}
          </select>

          <Link
            href={`/goals/${goal.id}`}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
