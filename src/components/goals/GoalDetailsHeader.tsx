import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

interface GoalDetailsHeaderProps {
  editing: boolean;
  deleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function GoalDetailsHeader({
  editing,
  deleting,
  onEdit,
  onDelete,
}: GoalDetailsHeaderProps) {
  return (
    <div className="mb-8">
      <Link
        href="/goals"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Goals
      </Link>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Goal Details</h1>
          <p className="mt-2 text-gray-600">View and manage goal information</p>
        </div>
        {!editing && (
          <div className="flex space-x-3">
            <button
              onClick={onEdit}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </button>
            <button
              onClick={onDelete}
              disabled={deleting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
