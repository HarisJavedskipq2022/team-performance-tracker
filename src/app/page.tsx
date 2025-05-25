"use client";

import Navigation from "@/components/Navigation";
import { GoalWithUser, isOverdue } from "@/lib/types";
import { Award, FileText, Target, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
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

  const statsCards = [
    {
      name: "Active Goals",
      value: stats.totalGoals.toString(),
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "Team Members",
      value: stats.totalUsers.toString(),
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      name: "Completed Goals",
      value: stats.completedGoals.toString(),
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      name: "In Progress",
      value: stats.inProgressGoals.toString(),
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const quickActions = [
    {
      name: "Create New Goal",
      description: "Set up a new goal for team members",
      href: "/goals/new",
      icon: Target,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      name: "View All Goals",
      description: "Manage and track all team goals",
      href: "/goals",
      icon: Target,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      name: "Team Overview",
      description: "View team members and assignments",
      href: "/team",
      icon: Users,
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      name: "Performance Reports",
      description: "Generate performance analytics",
      href: "/reports",
      icon: FileText,
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome to your Team Performance Tracker. Monitor goals, track
            progress, and manage your team effectively.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className={`${stat.bgColor} rounded-lg shadow p-6 border border-gray-100`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alert Cards for Important Metrics */}
        {(stats.overdueGoals > 0 || stats.criticalGoals > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {stats.overdueGoals > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Target className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-red-900">
                      Overdue Goals
                    </h3>
                    <p className="text-3xl font-bold text-red-600">
                      {stats.overdueGoals}
                    </p>
                    <p className="text-sm text-red-700">
                      Goals past their due date
                    </p>
                  </div>
                </div>
              </div>
            )}

            {stats.criticalGoals > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Award className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-yellow-900">
                      Critical Priority
                    </h3>
                    <p className="text-3xl font-bold text-yellow-600">
                      {stats.criticalGoals}
                    </p>
                    <p className="text-sm text-yellow-700">
                      High priority goals requiring attention
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.name}
                  href={action.href}
                  className="group relative bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex-shrink-0 w-10 h-10 ${action.color} rounded-lg flex items-center justify-center transition-colors`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                        {action.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Goals</h2>
          </div>
          <div className="p-6">
            {recentGoals.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No goals yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start by creating goals to see activity here.
                </p>
                <div className="mt-6">
                  <Link
                    href="/goals/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Target className="mr-2 h-4 w-4" />
                    Create Goal
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {recentGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {goal.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Assigned to {goal.user.name} •{" "}
                        {goal.status.replace("_", " ").toLowerCase()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          goal.priority === "CRITICAL"
                            ? "bg-red-100 text-red-800"
                            : goal.priority === "HIGH"
                            ? "bg-orange-100 text-orange-800"
                            : goal.priority === "MEDIUM"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {goal.priority}
                      </span>
                      <Link
                        href={`/goals/${goal.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
                <div className="mt-6 text-center">
                  <Link
                    href="/goals"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View All Goals
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
