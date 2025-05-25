"use client";

import Navigation from "@/components/Navigation";
import AlertCards from "@/components/dashboard/AlertCards";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import DashboardStats from "@/components/dashboard/DashboardStats";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { GoalWithUser, isOverdue } from "@/lib/types";
import { useEffect, useState } from "react";

type DashboardStats = {
  totalGoals: number;
  totalUsers: number;
  completedGoals: number;
  inProgressGoals: number;
  overdueGoals: number;
  criticalGoals: number;
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalGoals: 0,
    totalUsers: 0,
    completedGoals: 0,
    inProgressGoals: 0,
    overdueGoals: 0,
    criticalGoals: 0,
  });
  const [recentGoals, setRecentGoals] = useState<GoalWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [goalsResponse, usersResponse] = await Promise.all([
        fetch("/api/goals"),
        fetch("/api/users"),
      ]);

      if (goalsResponse.ok && usersResponse.ok) {
        const goals: GoalWithUser[] = await goalsResponse.json();
        const users = await usersResponse.json();

        const totalGoals = goals.length;
        const totalUsers = users.length;
        const completedGoals = goals.filter(
          (g) => g.status === "COMPLETED"
        ).length;
        const inProgressGoals = goals.filter(
          (g) => g.status === "IN_PROGRESS"
        ).length;
        const overdueGoals = goals.filter(
          (g) => isOverdue(g.dueDate) && g.status !== "COMPLETED"
        ).length;
        const criticalGoals = goals.filter(
          (g) => g.priority === "CRITICAL"
        ).length;

        setStats({
          totalGoals,
          totalUsers,
          completedGoals,
          inProgressGoals,
          overdueGoals,
          criticalGoals,
        });

        const sortedGoals = goals
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5);
        setRecentGoals(sortedGoals);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome to your Team Performance Tracker. Monitor goals, track
            progress, and manage your team effectively.
          </p>
        </div>

        {/* Stats Grid */}
        <DashboardStats
          totalGoals={stats.totalGoals}
          totalUsers={stats.totalUsers}
          completedGoals={stats.completedGoals}
          inProgressGoals={stats.inProgressGoals}
        />

        {/* Alert Cards for Important Metrics */}
        <AlertCards
          overdueGoals={stats.overdueGoals}
          criticalGoals={stats.criticalGoals}
        />

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Activity */}
        <RecentActivity recentGoals={recentGoals} />
      </div>
    </div>
  );
}
