import { Calendar } from "lucide-react";
import GoalFormSection from "./GoalFormSection";

interface GoalTimelineProps {
  dueDate: string;
  onDueDateChange: (value: string) => void;
}

export default function GoalTimeline({
  dueDate,
  onDueDateChange,
}: GoalTimelineProps) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <GoalFormSection
      title="Timeline"
      icon={Calendar}
      iconColor="text-purple-600"
    >
      <div>
        <label
          htmlFor="dueDate"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Due Date
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
            min={today}
            className="w-full pl-12 pr-4 py-3 text-gray-900 bg-white rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Optional: Set a target completion date for this goal
        </p>
      </div>
    </GoalFormSection>
  );
}
