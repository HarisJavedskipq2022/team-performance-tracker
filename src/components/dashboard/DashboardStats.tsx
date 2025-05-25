import { Award, Target, TrendingUp, Users } from "lucide-react";

interface DashboardStatsProps {
  totalGoals: number;
  totalUsers: number;
  completedGoals: number;
  inProgressGoals: number;
}

export default function DashboardStats({
  totalGoals,
  totalUsers,
  completedGoals,
  inProgressGoals,
}: DashboardStatsProps) {
  const statsCards = [
    {
      name: "Active Goals",
      value: totalGoals.toString(),
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "Team Members",
      value: totalUsers.toString(),
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      name: "Completed Goals",
      value: completedGoals.toString(),
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      name: "In Progress",
      value: inProgressGoals.toString(),
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
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
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
