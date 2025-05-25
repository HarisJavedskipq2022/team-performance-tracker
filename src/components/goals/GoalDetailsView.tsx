import {
  GoalWithUser,
  formatDate,
  goalStatusColors,
  goalStatusLabels,
  isOverdue,
  priorityColors,
  priorityLabels,
} from "@/lib/types";
import { AlertCircle, Calendar, Flag, User } from "lucide-react";

interface GoalDetailsViewProps {
  goal: GoalWithUser;
}

export default function GoalDetailsView({ goal }: GoalDetailsViewProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {goal.title}
            </h2>

            <div className="flex flex-wrap gap-4 mb-6">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  goalStatusColors[goal.status]
                }`}
              >
                {goalStatusLabels[goal.status]}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  priorityColors[goal.priority]
                }`}
              >
                <Flag className="mr-1 h-3 w-3" />
                {priorityLabels[goal.priority]}
              </span>
            </div>
          </div>

          {goal.description && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-gray-600 whitespace-pre-wrap">
                {goal.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Assignment
              </h3>
              <div className="flex items-center text-gray-600">
                <User className="mr-2 h-5 w-5" />
                <div>
                  <p className="font-medium">{goal.user.name}</p>
                  <p className="text-sm">{goal.user.email}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Timeline
              </h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2 h-5 w-5" />
                  <span>Created: {formatDate(goal.createdAt)}</span>
                </div>
                {goal.dueDate && (
                  <div
                    className={`flex items-center ${
                      isOverdue(goal.dueDate) && goal.status !== "COMPLETED"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    <span>Due: {formatDate(goal.dueDate)}</span>
                    {isOverdue(goal.dueDate) && goal.status !== "COMPLETED" && (
                      <AlertCircle className="ml-2 h-4 w-4" />
                    )}
                  </div>
                )}
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2 h-5 w-5" />
                  <span>Last updated: {formatDate(goal.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
