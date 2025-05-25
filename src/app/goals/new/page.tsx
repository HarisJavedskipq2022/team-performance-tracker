"use client";

import Navigation from "@/components/Navigation";
import GoalBasicInfo from "@/components/goals/GoalBasicInfo";
import GoalAssignment from "@/components/goals/GoalAssignment";
import GoalPriority from "@/components/goals/GoalPriority";
import GoalTimeline from "@/components/goals/GoalTimeline";
import GoalPreview from "@/components/goals/GoalPreview";
import GoalTipsCard from "@/components/goals/GoalTipsCard";
import { useToast } from "@/contexts/ToastContext";
import { Priority } from "@prisma/client";
import { AlertCircle, ArrowLeft, Save, Target } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type UserOption = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function NewGoalPage() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    userId: "",
    priority: Priority.MEDIUM,
    dueDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.userId) {
      newErrors.userId = "Please select a team member";
    }

    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const createdGoal = await response.json();
        showSuccess(
          "Goal Created Successfully!",
          `"${formData.title}" has been assigned to the team member.`
        );
        router.push("/goals");
      } else {
        const error = await response.json();
        const errorMessage = error.error || "Failed to create goal";
        setErrors({ submit: errorMessage });
        showError("Failed to Create Goal", errorMessage);
      }
    } catch (error) {
      const errorMessage = "Failed to create goal. Please try again.";
      setErrors({ submit: errorMessage });
      showError("Network Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const getPriorityColor = (priority: Priority) => {
    const colors = {
      LOW: "bg-gray-50 border-gray-200 text-gray-700",
      MEDIUM: "bg-yellow-50 border-yellow-200 text-yellow-800",
      HIGH: "bg-orange-50 border-orange-200 text-orange-800",
      CRITICAL: "bg-red-50 border-red-200 text-red-800",
    };
    return colors[priority] || colors.MEDIUM;
  };

  const selectedUser = users.find((user) => user.id === formData.userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/goals"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-6 font-medium transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Goals
          </Link>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Create New Goal
              </h1>
              <p className="mt-1 text-lg text-gray-600">
                Set up a new goal to drive team performance and growth
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">
                  Goal Details
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-8">
                {/* Goal Basic Information */}
                <GoalBasicInfo
                  title={formData.title}
                  description={formData.description}
                  onTitleChange={(value) => handleInputChange("title", value)}
                  onDescriptionChange={(value) =>
                    handleInputChange("description", value)
                  }
                  titleError={errors.title}
                />

                {/* Goal Assignment */}
                <GoalAssignment
                  userId={formData.userId}
                  users={users}
                  onUserChange={(value) => handleInputChange("userId", value)}
                  userError={errors.userId}
                />

                {/* Priority & Timeline Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GoalPriority
                    priority={formData.priority}
                    onPriorityChange={(value) =>
                      handleInputChange("priority", value)
                    }
                  />

                  <GoalTimeline
                    dueDate={formData.dueDate}
                    onDueDateChange={(value) =>
                      handleInputChange("dueDate", value)
                    }
                  />
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
                  <Link
                    href="/goals"
                    className="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-8 py-3 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Goal...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Create Goal
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Goal Preview */}
            <GoalPreview
              title={formData.title}
              priority={formData.priority}
              dueDate={formData.dueDate}
              selectedUser={selectedUser}
            />

            {/* Goal Tips */}
            <GoalTipsCard />
          </div>
        </div>
      </div>
    </div>
  );
}
