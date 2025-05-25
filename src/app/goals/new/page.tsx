"use client";

import Navigation from "@/components/Navigation";
import { priorityLabels } from "@/lib/types";
import { Priority } from "@prisma/client";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Flag,
  Save,
  Target,
  User,
} from "lucide-react";
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
        router.push("/goals");
      } else {
        const error = await response.json();
        setErrors({ submit: error.error || "Failed to create goal" });
      }
    } catch (error) {
      setErrors({ submit: "Failed to create goal. Please try again." });
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
                {/* Title Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-medium text-gray-900">
                      Goal Information
                    </h3>
                  </div>

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
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      className={`w-full px-4 py-3 text-gray-900 bg-white rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.title
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-gray-300 focus:border-blue-500"
                      }`}
                      placeholder="e.g., Increase customer satisfaction by 15%"
                    />
                    {errors.title && (
                      <div className="mt-2 flex items-center space-x-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm">{errors.title}</p>
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
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        className="w-full pl-12 pr-4 py-3 text-gray-900 bg-white rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Describe the goal, success criteria, and any important details..."
                      />
                    </div>
                  </div>
                </div>

                {/* Assignment Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-medium text-gray-900">
                      Assignment
                    </h3>
                  </div>

                  <div>
                    <label
                      htmlFor="userId"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Assign to Team Member *
                    </label>
                    <select
                      id="userId"
                      value={formData.userId}
                      onChange={(e) =>
                        handleInputChange("userId", e.target.value)
                      }
                      className={`w-full px-4 py-3 text-gray-900 bg-white rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.userId
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <option value="" className="text-gray-500">
                        Choose a team member...
                      </option>
                      {users.map((user) => (
                        <option
                          key={user.id}
                          value={user.id}
                          className="text-gray-900"
                        >
                          {user.name} • {user.role}
                        </option>
                      ))}
                    </select>
                    {errors.userId && (
                      <div className="mt-2 flex items-center space-x-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm">{errors.userId}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Priority & Timeline Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Flag className="h-5 w-5 text-orange-600" />
                      <h3 className="text-lg font-medium text-gray-900">
                        Priority
                      </h3>
                    </div>

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
                            checked={formData.priority === value}
                            onChange={(e) =>
                              handleInputChange("priority", e.target.value)
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

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <h3 className="text-lg font-medium text-gray-900">
                        Timeline
                      </h3>
                    </div>

                    <div>
                      <label
                        htmlFor="dueDate"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Due Date
                      </label>
                      <div className="relative">
                        <Clock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                        <input
                          type="date"
                          id="dueDate"
                          value={formData.dueDate}
                          onChange={(e) =>
                            handleInputChange("dueDate", e.target.value)
                          }
                          className={`w-full pl-12 pr-4 py-3 text-gray-900 bg-white rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.dueDate
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      {errors.dueDate && (
                        <div className="mt-2 flex items-center space-x-2 text-red-600">
                          <AlertCircle className="h-4 w-4" />
                          <p className="text-sm">{errors.dueDate}</p>
                        </div>
                      )}
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
            {/* Preview Card */}
            <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 px-4 py-3">
                <h3 className="text-sm font-semibold text-white">
                  Goal Preview
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    Title
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    {formData.title || "Enter goal title..."}
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
                        <p className="text-xs text-gray-500">
                          {selectedUser.role}
                        </p>
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
                      formData.priority
                    )}`}
                  >
                    {priorityLabels[formData.priority]}
                  </span>
                </div>

                {formData.dueDate && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      Due Date
                    </p>
                    <p className="text-sm text-gray-900">
                      {new Date(formData.dueDate).toLocaleDateString("en-US", {
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

            {/* Tips Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-semibold text-blue-900">
                  Goal Setting Tips
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Make goals specific and measurable</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Set realistic but challenging targets</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Include clear success criteria</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Align with team and company objectives</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
