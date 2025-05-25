"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import { ArrowLeft, Save, User, Calendar, Flag } from "lucide-react";
import Link from "next/link";
import { Priority } from "@prisma/client";
import { priorityLabels } from "@/lib/types";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/goals"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Goals
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Goal</h1>
          <p className="mt-2 text-gray-600">
            Set up a new goal for your team member
          </p>
        </div>

        {/* Form */}
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Title */}
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
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.title ? "border-red-300" : ""
                }`}
                placeholder="Enter goal title..."
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe the goal in detail..."
              />
            </div>

            {/* User Assignment */}
            <div>
              <label
                htmlFor="userId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <User className="inline mr-1 h-4 w-4" />
                Assign to Team Member *
              </label>
              <select
                id="userId"
                value={formData.userId}
                onChange={(e) => handleInputChange("userId", e.target.value)}
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.userId ? "border-red-300" : ""
                }`}
              >
                <option value="">Select a team member...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email}) - {user.role}
                  </option>
                ))}
              </select>
              {errors.userId && (
                <p className="mt-1 text-sm text-red-600">{errors.userId}</p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <Flag className="inline mr-1 h-4 w-4" />
                Priority
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => handleInputChange("priority", e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {Object.entries(priorityLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <Calendar className="inline mr-1 h-4 w-4" />
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.dueDate ? "border-red-300" : ""
                }`}
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Link
                href="/goals"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
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
    </div>
  );
}
