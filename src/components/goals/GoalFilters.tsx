import { goalStatusLabels, priorityLabels } from "@/lib/types";
import { AlertCircle, Filter, Search, Target } from "lucide-react";

interface FilterState {
  status: string;
  priority: string;
  search: string;
}

interface GoalFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export default function GoalFilters({
  filters,
  onFiltersChange,
  showFilters,
  onToggleFilters,
}: GoalFiltersProps) {
  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilter = (key: keyof FilterState) => {
    onFiltersChange({ ...filters, [key]: "" });
  };

  const clearAllFilters = () => {
    onFiltersChange({ search: "", status: "", priority: "" });
  };

  const hasActiveFilters = filters.search || filters.status || filters.priority;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Filters & Search
            </h2>
          </div>
          <button
            onClick={onToggleFilters}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
          >
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? "Hide" : "Show"} Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                <Search className="inline mr-1 h-4 w-4" />
                Search Goals
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={filters.search}
                  onChange={(e) => updateFilter("search", e.target.value)}
                  className="pl-10 w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                <Target className="inline mr-1 h-4 w-4" />
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => updateFilter("status", e.target.value)}
                className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="" className="text-gray-900">
                  All Statuses
                </option>
                {Object.entries(goalStatusLabels).map(([value, label]) => (
                  <option key={value} value={value} className="text-gray-900">
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                <AlertCircle className="inline mr-1 h-4 w-4" />
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => updateFilter("priority", e.target.value)}
                className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="" className="text-gray-900">
                  All Priorities
                </option>
                {Object.entries(priorityLabels).map(([value, label]) => (
                  <option key={value} value={value} className="text-gray-900">
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Active filters:
                </span>

                {filters.search && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Search: "{filters.search}"
                    <button
                      onClick={() => clearFilter("search")}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}

                {filters.status && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Status:{" "}
                    {
                      goalStatusLabels[
                        filters.status as keyof typeof goalStatusLabels
                      ]
                    }
                    <button
                      onClick={() => clearFilter("status")}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}

                {filters.priority && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Priority:{" "}
                    {
                      priorityLabels[
                        filters.priority as keyof typeof priorityLabels
                      ]
                    }
                    <button
                      onClick={() => clearFilter("priority")}
                      className="ml-1 text-orange-600 hover:text-orange-800"
                    >
                      ×
                    </button>
                  </span>
                )}

                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
