import { priorityLabels } from "@/lib/types";
import { Priority } from "@prisma/client";
import { Flag } from "lucide-react";
import GoalFormSection from "./GoalFormSection";

interface GoalPriorityProps {
  priority: Priority;
  onPriorityChange: (value: string) => void;
}

export default function GoalPriority({
  priority,
  onPriorityChange,
}: GoalPriorityProps) {
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
    <GoalFormSection title="Priority" icon={Flag} iconColor="text-orange-600">
      <div className="space-y-3">
        {Object.entries(priorityLabels).map(([value, label]) => (
          <label
            key={value}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <input
              type="radio"
              name="priority"
              value={value}
              checked={priority === value}
              onChange={(e) => onPriorityChange(e.target.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(
                value as Priority
              )}`}
            >
              {label}
            </span>
          </label>
        ))}
      </div>
    </GoalFormSection>
  );
}
