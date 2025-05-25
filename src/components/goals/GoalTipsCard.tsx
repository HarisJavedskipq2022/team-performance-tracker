import { CheckCircle2 } from "lucide-react";

export default function GoalTipsCard() {
  const tips = [
    "Make goals specific and measurable",
    "Set realistic but challenging targets",
    "Include clear success criteria",
    "Align with team and company objectives",
  ];

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
      <div className="flex items-center space-x-2 mb-3">
        <CheckCircle2 className="h-5 w-5 text-blue-600" />
        <h3 className="text-sm font-semibold text-blue-900">
          Goal Setting Tips
        </h3>
      </div>
      <ul className="space-y-2 text-sm text-blue-800">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start space-x-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
