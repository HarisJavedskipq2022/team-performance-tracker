import { GoalWithUser } from "@/lib/types";
import { Target, TrendingUp } from "lucide-react";
import Link from "next/link";

interface RecentActivityProps {
  recentGoals: GoalWithUser[];
}

export default function RecentActivity({ recentGoals }: RecentActivityProps) {
  return (
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
  );
}
