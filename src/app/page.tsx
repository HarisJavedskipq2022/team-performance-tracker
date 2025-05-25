import Link from "next/link";
import Navigation from "@/components/Navigation";
import {
  Target,
  Users,
  MessageSquare,
  FileText,
  Award,
  TrendingUp,
} from "lucide-react";

const stats = [
  { name: "Active Goals", value: "12", icon: Target, color: "text-blue-600" },
  { name: "Team Members", value: "8", icon: Users, color: "text-green-600" },
  {
    name: "Feedback Items",
    value: "24",
    icon: MessageSquare,
    color: "text-purple-600",
  },
  {
    name: "Reviews Completed",
    value: "6",
    icon: FileText,
    color: "text-orange-600",
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
    name: "Give Feedback",
    description: "Provide feedback to team members",
    href: "/feedback/new",
    icon: MessageSquare,
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    name: "View Team",
    description: "Manage team members and roles",
    href: "/team",
    icon: Users,
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    name: "Skills Assessment",
    description: "Assess and track team skills",
    href: "/skills",
    icon: Award,
    color: "bg-orange-500 hover:bg-orange-600",
  },
];

export default function Dashboard() {
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
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
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
                  className="group relative bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
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
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Activity
            </h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No recent activity
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Start by creating goals or giving feedback to see activity here.
              </p>
              <div className="mt-6">
                <Link
                  href="/goals"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Target className="mr-2 h-4 w-4" />
                  View Goals
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
