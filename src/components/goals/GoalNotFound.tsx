import Navigation from "@/components/Navigation";
import { Target } from "lucide-react";
import Link from "next/link";

export default function GoalNotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Target className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Goal not found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            The goal you're looking for doesn't exist or has been deleted.
          </p>
          <div className="mt-6">
            <Link
              href="/goals"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Goals
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
