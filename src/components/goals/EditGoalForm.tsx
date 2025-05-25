import { goalStatusLabels, priorityLabels } from "@/lib/types";
import { GoalStatus, Priority } from "@prisma/client";
import {
  AlertCircle,
  Calendar,
  FileText,
  Flag,
  Save,
  Target,
  X,
} from "lucide-react";

interface EditGoalFormProps {
  editData: {
    title: string;
    description: string;
    status: GoalStatus;
    priority: Priority;
    dueDate: string;
  };
  errors: Record<string, string>;
  saving: boolean;
  onInputChange: (field: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function EditGoalForm({
  editData,
  errors,
  saving,
  onInputChange,
  onSave,
  onCancel,
}: EditGoalFormProps) {
  const getPriorityColor = (priority: Priority) => {
    const colors = {
      LOW: "bg-gray-50 border-gray-200 text-gray-700",
      MEDIUM: "bg-yellow-50 border-yellow-200 text-yellow-800",
      HIGH: "bg-orange-50 border-orange-200 text-orange-800",
      CRITICAL: "bg-red-50 border-red-200 text-red-800",
    };
    return colors[priority] || colors.MEDIUM;
  };

  const getStatusColor = (status: GoalStatus) => {
    const colors = {
      NOT_STARTED: "bg-gray-50 border-gray-200 text-gray-700",
      IN_PROGRESS: "bg-blue-50 border-blue-200 text-blue-800",
      COMPLETED: "bg-green-50 border-green-200 text-green-800",
      CANCELLED: "bg-red-50 border-red-200 text-red-700",
    };
    return colors[status] || colors.NOT_STARTED;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl p-8 border border-gray-100">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Target className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Edit Goal</h3>
            <p className="text-sm text-gray-600">
              Update goal information and settings
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Goal Information Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <Target className="h-5 w-5 text-blue-600" />
            <h4 className="text-lg font-medium text-gray-900">
              Goal Information
            </h4>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Goal Title *
              </label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) => onInputChange("title", e.target.value)}
                className={`w-full px-4 py-3 text-gray-900 bg-white rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                placeholder="Enter goal title..."
              />
              {errors.title && (
                <div className="mt-2 flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-sm">{errors.title}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <div className="relative">
                <FileText className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <textarea
                  rows={4}
                  value={editData.description}
                  onChange={(e) => onInputChange("description", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-gray-900 bg-white rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Describe the goal, success criteria, and any important details..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status & Settings Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <Flag className="h-5 w-5 text-orange-600" />
            <h4 className="text-lg font-medium text-gray-900">
              Status & Settings
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Status
              </label>
              <div className="space-y-3">
                {Object.entries(goalStatusLabels).map(([value, label]) => (
                  <label
                    key={value}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="status"
                      value={value}
                      checked={editData.status === value}
                      onChange={(e) => onInputChange("status", e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        value as GoalStatus
                      )}`}
                    >
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Priority
              </label>
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
                      checked={editData.priority === value}
                      onChange={(e) =>
                        onInputChange("priority", e.target.value)
                      }
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
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Due Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={editData.dueDate}
                  onChange={(e) => onInputChange("dueDate", e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 text-gray-900 bg-white rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.dueDate
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                />
              </div>
              {errors.dueDate && (
                <div className="mt-2 flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-sm">{errors.dueDate}</p>
                </div>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Optional: Set a target completion date
              </p>
            </div>
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-600 font-medium">
                {errors.submit}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            <X className="mr-2 h-4 w-4 inline" />
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center px-8 py-3 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
