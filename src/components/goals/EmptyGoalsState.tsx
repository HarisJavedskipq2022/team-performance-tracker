import { Plus, Target } from "lucide-react";
import Link from "next/link";

export default function EmptyGoalsState() {
  return (
    <div className="text-center py-12">
      <Target className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No goals found</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new goal.
      </p>
      <div className="mt-6">
        <Link
          href="/goals/new"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Goal
        </Link>
      </div>
    </div>
  );
}
