import { AlertCircle, User } from "lucide-react";
import GoalFormSection from "./GoalFormSection";

interface UserOption {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface GoalAssignmentProps {
  userId: string;
  users: UserOption[];
  onUserChange: (value: string) => void;
  userError?: string;
}

export default function GoalAssignment({
  userId,
  users,
  onUserChange,
  userError,
}: GoalAssignmentProps) {
  return (
    <GoalFormSection title="Assignment" icon={User} iconColor="text-green-600">
      <div>
        <label
          htmlFor="userId"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Assign to Team Member *
        </label>
        <select
          id="userId"
          value={userId}
          onChange={(e) => onUserChange(e.target.value)}
          className={`w-full px-4 py-3 text-gray-900 bg-white rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            userError
              ? "border-red-300 bg-red-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <option value="" className="text-gray-500">
            Choose a team member...
          </option>
          {users.map((user) => (
            <option key={user.id} value={user.id} className="text-gray-900">
              {user.name} • {user.role}
            </option>
          ))}
        </select>
        {userError && (
          <div className="mt-2 flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{userError}</p>
          </div>
        )}
      </div>
    </GoalFormSection>
  );
}
