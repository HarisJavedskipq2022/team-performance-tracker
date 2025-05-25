import { AlertCircle, FileText, Target } from "lucide-react";
import GoalFormSection from "./GoalFormSection";

interface GoalBasicInfoProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  titleError?: string;
}

export default function GoalBasicInfo({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  titleError,
}: GoalBasicInfoProps) {
  return (
    <GoalFormSection
      title="Goal Information"
      icon={Target}
      iconColor="text-blue-600"
    >
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Goal Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className={`w-full px-4 py-3 text-gray-900 bg-white rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            titleError
              ? "border-red-300 bg-red-50"
              : "border-gray-200 hover:border-gray-300 focus:border-blue-500"
          }`}
          placeholder="e.g., Increase customer satisfaction by 15%"
        />
        {titleError && (
          <div className="mt-2 flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{titleError}</p>
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Description
        </label>
        <div className="relative">
          <FileText className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-gray-900 bg-white rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            placeholder="Describe the goal, success criteria, and any important details..."
          />
        </div>
      </div>
    </GoalFormSection>
  );
}
