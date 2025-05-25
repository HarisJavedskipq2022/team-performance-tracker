"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Save,
  X,
  User,
  Calendar,
  Flag,
  Target,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { GoalStatus, Priority } from "@prisma/client";
import {
  GoalWithUser,
  goalStatusLabels,
  priorityLabels,
  goalStatusColors,
  priorityColors,
  formatDate,
  isOverdue,
} from "@/lib/types";

export default function GoalDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [goal, setGoal] = useState<GoalWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    status: GoalStatus.NOT_STARTED as GoalStatus,
    priority: Priority.MEDIUM as Priority,
    dueDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchGoal();
  }, [params.id]);

  const fetchGoal = async () => {
    try {
      const response = await fetch(`/api/goals/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setGoal(data);
        setEditData({
          title: data.title,
          description: data.description || "",
          status: data.status,
          priority: data.priority,
          dueDate: data.dueDate
            ? new Date(data.dueDate).toISOString().split("T")[0]
            : "",
        });
      } else if (response.status === 404) {
        router.push("/goals");
      }
    } catch (error) {
      console.error("Error fetching goal:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setErrors({});
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setErrors({});
    if (goal) {
      setEditData({
        title: goal.title,
        description: goal.description || "",
        status: goal.status,
        priority: goal.priority,
        dueDate: goal.dueDate
          ? new Date(goal.dueDate).toISOString().split("T")[0]
          : "",
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!editData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (editData.dueDate) {
      const dueDate = new Date(editData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dueDate < today && editData.status !== "COMPLETED") {
        newErrors.dueDate = "Due date cannot be in the past for active goals";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/goals/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editData,
          dueDate: editData.dueDate || null,
        }),
      });

      if (response.ok) {
        const updatedGoal = await response.json();
        setGoal(updatedGoal);
        setEditing(false);
      } else {
        const error = await response.json();
        setErrors({ submit: error.error || "Failed to update goal" });
      }
    } catch (error) {
      setErrors({ submit: "Failed to update goal. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this goal? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/goals/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/goals");
      } else {
        const error = await response.json();
        setErrors({ submit: error.error || "Failed to delete goal" });
      }
    } catch (error) {
      setErrors({ submit: "Failed to delete goal. Please try again." });
    } finally {
      setDeleting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData({ ...editData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Target className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Goal not found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              The goal you're looking for doesn't exist or has been deleted.
            </p>
            <div className="mt-6">
              <Link
                href="/goals"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Back to Goals
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/goals"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Goals
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Goal Details</h1>
              <p className="mt-2 text-gray-600">
                View and manage goal information
              </p>
            </div>
            {!editing && (
              <div className="flex space-x-3">
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Goal Content */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            {editing ? (
              /* Edit Form */
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.title ? "border-red-300" : ""
                    }`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={editData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={editData.status}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {Object.entries(goalStatusLabels).map(
                        ([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={editData.priority}
                      onChange={(e) =>
                        handleInputChange("priority", e.target.value)
                      }
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {Object.entries(priorityLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={editData.dueDate}
                      onChange={(e) =>
                        handleInputChange("dueDate", e.target.value)
                      }
                      className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                        errors.dueDate ? "border-red-300" : ""
                      }`}
                    />
                    {errors.dueDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.dueDate}
                      </p>
                    )}
                  </div>
                </div>

                {errors.submit && (
                  <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <X className="mr-2 h-4 w-4 inline" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
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
            ) : (
              /* View Mode */
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
                            isOverdue(goal.dueDate) &&
                            goal.status !== "COMPLETED"
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          <Calendar className="mr-2 h-5 w-5" />
                          <span>Due: {formatDate(goal.dueDate)}</span>
                          {isOverdue(goal.dueDate) &&
                            goal.status !== "COMPLETED" && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
