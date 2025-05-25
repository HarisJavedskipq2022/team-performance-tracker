import { priorityLabels } from "@/lib/types";
import { Priority } from "@prisma/client";
import { User } from "lucide-react";

interface UserOption {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface GoalPreviewProps {
  title: string;
  priority: Priority;
  dueDate: string;
  selectedUser: UserOption | undefined;
}

export default function GoalPreview({
  title,
  priority,
  dueDate,
  selectedUser,
}: GoalPreviewProps) {
  const getPriorityColor = (priority: Priority) => {
    const colors = {
      LOW: "bg-gray-50 border-gray-200 text-gray-700",
      MEDIUM: "bg-yellow-50 border-yellow-200 text-yellow-800",
      HIGH: "bg-orange-50 border-orange-200 text-orange-800",
      CRITICAL: "bg-red-50 border-red-200 text-red-800",
    };
    return colors[priority] || colors.MEDIUM;
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-teal-600 px-4 py-3">
        <h3 className="text-sm font-semibold text-white">Goal Preview</h3>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            Title
          </p>
          <p className="text-sm text-gray-900 font-medium">
            {title || "Enter goal title..."}
          </p>
        </div>

        {selectedUser && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
              Assigned To
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedUser.name}
                </p>
                <p className="text-xs text-gray-500">{selectedUser.role}</p>
              </div>
            </div>
          </div>
        )}

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            Priority
          </p>
          <span
            className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
              priority
            )}`}
          >
            {priorityLabels[priority]}
          </span>
        </div>

        {dueDate && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
              Due Date
            </p>
            <p className="text-sm text-gray-900">
              {new Date(dueDate).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
