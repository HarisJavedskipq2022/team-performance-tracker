import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface GoalFormSectionProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  children: ReactNode;
}

export default function GoalFormSection({
  title,
  icon: Icon,
  iconColor,
  children,
}: GoalFormSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}
