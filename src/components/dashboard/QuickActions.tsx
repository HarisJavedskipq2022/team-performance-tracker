import { FileText, Target, Users } from "lucide-react";
import Link from "next/link";

export default function QuickActions() {
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

  return (
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
  );
}
