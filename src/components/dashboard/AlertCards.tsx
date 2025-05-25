import { Award, Target } from "lucide-react";

interface AlertCardsProps {
  overdueGoals: number;
  criticalGoals: number;
}

export default function AlertCards({
  overdueGoals,
  criticalGoals,
}: AlertCardsProps) {
  if (overdueGoals === 0 && criticalGoals === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {overdueGoals > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-900">
                Overdue Goals
              </h3>
              <p className="text-3xl font-bold text-red-600">{overdueGoals}</p>
              <p className="text-sm text-red-700">Goals past their due date</p>
            </div>
          </div>
        </div>
      )}

      {criticalGoals > 0 && (
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
                {criticalGoals}
              </p>
              <p className="text-sm text-yellow-700">
                High priority goals requiring attention
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
