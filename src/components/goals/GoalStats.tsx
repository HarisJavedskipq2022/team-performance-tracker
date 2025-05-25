import { AlertCircle, Target } from "lucide-react";

interface GoalStatsProps {
  totalGoals: number;
  completedGoals: number;
  inProgressGoals: number;
  overdueGoals: number;
}

export default function GoalStats({
  totalGoals,
  completedGoals,
  inProgressGoals,
  overdueGoals,
}: GoalStatsProps) {
  const stats = [
    {
      label: "Total Goals",
      value: totalGoals,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-white",
    },
    {
      label: "Completed",
      value: completedGoals,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "In Progress",
      value: inProgressGoals,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Overdue",
      value: overdueGoals,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`${stat.bgColor} rounded-lg shadow p-6`}
          >
            <div className="flex items-center">
              {index === 1 || index === 2 ? (
                <div
                  className={`h-8 w-8 ${stat.bgColor} rounded-full flex items-center justify-center`}
                >
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              ) : (
                <Icon className={`h-8 w-8 ${stat.color}`} />
              )}
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
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
  );
}
