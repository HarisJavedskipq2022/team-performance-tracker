"use client";

import Navigation from "@/components/Navigation";
import {
  GoalWithUser,
  formatDate,
  goalStatusColors,
  goalStatusLabels,
  isOverdue,
  priorityColors,
  priorityLabels,
} from "@/lib/types";
import { GoalStatus } from "@prisma/client";
import {
  AlertCircle,
  Calendar,
  Filter,
  Plus,
  Search,
  Target,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function GoalsPage() {
  const [goals, setGoals] = useState<GoalWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, [filters]);

  const fetchGoals = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.search) params.append("search", filters.search);

      const response = await fetch(`/api/goals?${params}`);
      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (goalId: string, newStatus: GoalStatus) => {
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchGoals();
      }
    } catch (error) {
      console.error("Error updating goal status:", error);
    }
  };

  const filteredGoalsCount = goals.length;
  const completedGoals = goals.filter((g) => g.status === "COMPLETED").length;
  const inProgressGoals = goals.filter(
    (g) => g.status === "IN_PROGRESS"
  ).length;
  const overdueGoals = goals.filter(
    (g) => isOverdue(g.dueDate) && g.status !== "COMPLETED"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Goals</h1>
            <p className="mt-2 text-gray-600">
              Track and manage team goals and objectives
            </p>
          </div>
          <Link
            href="/goals/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Goal
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Goals</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {filteredGoalsCount}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {completedGoals}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {inProgressGoals}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Overdue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {overdueGoals}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Filters & Search
                </h2>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? "Hide" : "Show"} Filters
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    <Search className="inline mr-1 h-4 w-4" />
                    Search Goals
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by title or description..."
                      value={filters.search}
                      onChange={(e) =>
                        setFilters({ ...filters, search: e.target.value })
                      }
                      className="pl-10 w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    <Target className="inline mr-1 h-4 w-4" />
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                    className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="" className="text-gray-900">
                      All Statuses
                    </option>
                    {Object.entries(goalStatusLabels).map(([value, label]) => (
                      <option
                        key={value}
                        value={value}
                        className="text-gray-900"
                      >
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    <AlertCircle className="inline mr-1 h-4 w-4" />
                    Priority
                  </label>
                  <select
                    value={filters.priority}
                    onChange={(e) =>
                      setFilters({ ...filters, priority: e.target.value })
                    }
                    className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="" className="text-gray-900">
                      All Priorities
                    </option>
                    {Object.entries(priorityLabels).map(([value, label]) => (
                      <option
                        key={value}
                        value={value}
                        className="text-gray-900"
                      >
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(filters.search || filters.status || filters.priority) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      Active filters:
                    </span>
                    {filters.search && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Search: "{filters.search}"
                        <button
                          onClick={() => setFilters({ ...filters, search: "" })}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.status && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Status:{" "}
                        {
                          goalStatusLabels[
                            filters.status as keyof typeof goalStatusLabels
                          ]
                        }
                        <button
                          onClick={() => setFilters({ ...filters, status: "" })}
                          className="ml-1 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.priority && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Priority:{" "}
                        {
                          priorityLabels[
                            filters.priority as keyof typeof priorityLabels
                          ]
                        }
                        <button
                          onClick={() =>
                            setFilters({ ...filters, priority: "" })
                          }
                          className="ml-1 text-orange-600 hover:text-orange-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    <button
                      onClick={() =>
                        setFilters({ search: "", status: "", priority: "" })
                      }
                      className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <div className="text-center py-12">
            <Target className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No goals found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new goal.
            </p>
            <div className="mt-6">
              <Link
                href="/goals/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Goal
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                      {goal.title}
                    </h3>
                    <div className="flex space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          priorityColors[goal.priority]
                        }`}
                      >
                        {priorityLabels[goal.priority]}
                      </span>
                    </div>
                  </div>

                  {goal.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {goal.description}
                    </p>
                  )}

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <User className="mr-1 h-4 w-4" />
                    {goal.user.name}
                  </div>

                  {goal.dueDate && (
                    <div
                      className={`flex items-center text-sm mb-4 ${
                        isOverdue(goal.dueDate) && goal.status !== "COMPLETED"
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      <Calendar className="mr-1 h-4 w-4" />
                      Due {formatDate(goal.dueDate)}
                      {isOverdue(goal.dueDate) &&
                        goal.status !== "COMPLETED" && (
                          <AlertCircle className="ml-1 h-4 w-4" />
                        )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <select
                      value={goal.status}
                      onChange={(e) =>
                        handleStatusChange(
                          goal.id,
                          e.target.value as GoalStatus
                        )
                      }
                      className={`text-xs font-medium rounded-full px-3 py-1.5 border-2 cursor-pointer transition-all duration-200 hover:shadow-sm ${
                        goalStatusColors[goal.status]
                      }`}
                      style={{
                        backgroundColor: "white",
                        color:
                          goal.status === "COMPLETED"
                            ? "#065f46"
                            : goal.status === "IN_PROGRESS"
                            ? "#1e40af"
                            : goal.status === "CANCELLED"
                            ? "#dc2626"
                            : "#374151",
                      }}
                    >
                      {Object.entries(goalStatusLabels).map(
                        ([value, label]) => (
                          <option
                            key={value}
                            value={value}
                            className="text-gray-900 bg-white"
                          >
                            {label}
                          </option>
                        )
                      )}
                    </select>

                    <Link
                      href={`/goals/${goal.id}`}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
