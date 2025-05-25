"use client";

import Navigation from "@/components/Navigation";
import EmptyGoalsState from "@/components/goals/EmptyGoalsState";
import GoalCard from "@/components/goals/GoalCard";
import GoalFilters from "@/components/goals/GoalFilters";
import GoalStats from "@/components/goals/GoalStats";
import { useToast } from "@/contexts/ToastContext";
import { GoalWithUser, isOverdue } from "@/lib/types";
import { GoalStatus } from "@prisma/client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function GoalsPage() {
  const { showSuccess, showError } = useToast();
  const [goals, setGoals] = useState<GoalWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchGoals = useCallback(async () => {
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
  }, [filters]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleStatusChange = async (goalId: string, newStatus: GoalStatus) => {
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await response.json();
        fetchGoals();

        const statusMessages = {
          COMPLETED: "Goal marked as completed! 🎉",
          IN_PROGRESS: "Goal status updated to in progress",
          NOT_STARTED: "Goal status updated to not started",
          CANCELLED: "Goal has been cancelled",
        };

        showSuccess(
          "Status Updated",
          statusMessages[newStatus] || "Goal status updated successfully"
        );
      } else {
        throw new Error("Failed to update goal status");
      }
    } catch (error) {
      console.error("Error updating goal status:", error);
      showError(
        "Update Failed",
        "Failed to update goal status. Please try again."
      );
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
        <GoalStats
          totalGoals={filteredGoalsCount}
          completedGoals={completedGoals}
          inProgressGoals={inProgressGoals}
          overdueGoals={overdueGoals}
        />

        {/* Filters */}
        <GoalFilters
          filters={filters}
          onFiltersChange={setFilters}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <EmptyGoalsState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
