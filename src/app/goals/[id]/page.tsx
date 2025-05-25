"use client";

import EditGoalForm from "@/components/goals/EditGoalForm";
import GoalDetailsHeader from "@/components/goals/GoalDetailsHeader";
import GoalDetailsLoading from "@/components/goals/GoalDetailsLoading";
import GoalDetailsView from "@/components/goals/GoalDetailsView";
import GoalNotFound from "@/components/goals/GoalNotFound";
import Navigation from "@/components/Navigation";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/contexts/ToastContext";
import { GoalWithUser } from "@/lib/types";
import { GoalStatus, Priority } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GoalDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [goal, setGoal] = useState<GoalWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    status: GoalStatus.NOT_STARTED as GoalStatus,
    priority: Priority.MEDIUM as Priority,
    dueDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [goalId, setGoalId] = useState<string>("");

  useEffect(() => {
    const initializeParams = async () => {
      const { id } = await params;
      setGoalId(id);
    };
    initializeParams();
  }, [params]);

  useEffect(() => {
    if (goalId) {
      fetchGoal();
    }
  }, [goalId]);

  const fetchGoal = async () => {
    try {
      const response = await fetch(`/api/goals/${goalId}`);
      if (response.ok) {
        const data = await response.json();
        setGoal(data);
        setEditData({
          title: data.title,
          description: data.description || "",
          status: data.status,
          priority: data.priority,
          dueDate: data.dueDate
            ? new Date(data.dueDate).toISOString().split("T")[0]
            : "",
        });
      } else if (response.status === 404) {
        router.push("/goals");
      }
    } catch (error) {
      console.error("Error fetching goal:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setErrors({});
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setErrors({});
    if (goal) {
      setEditData({
        title: goal.title,
        description: goal.description || "",
        status: goal.status,
        priority: goal.priority,
        dueDate: goal.dueDate
          ? new Date(goal.dueDate).toISOString().split("T")[0]
          : "",
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!editData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (editData.dueDate) {
      const dueDate = new Date(editData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dueDate < today && editData.status !== "COMPLETED") {
        newErrors.dueDate = "Due date cannot be in the past for active goals";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editData,
          dueDate: editData.dueDate || null,
        }),
      });

      if (response.ok) {
        const updatedGoal = await response.json();
        setGoal(updatedGoal);
        setEditing(false);
        showSuccess(
          "Goal Updated Successfully!",
          `"${updatedGoal.title}" has been updated with the latest changes.`
        );
      } else {
        const error = await response.json();
        const errorMessage = error.error || "Failed to update goal";
        setErrors({ submit: errorMessage });
        showError("Update Failed", errorMessage);
      }
    } catch (error) {
      const errorMessage = "Failed to update goal. Please try again.";
      setErrors({ submit: errorMessage });
      showError("Network Error", errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);

    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showSuccess(
          "Goal Deleted Successfully!",
          `"${goal?.title}" has been permanently deleted.`
        );
        // Small delay to show the toast before navigation
        setTimeout(() => {
          router.push("/goals");
        }, 1000);
      } else {
        const error = await response.json();
        const errorMessage = error.error || "Failed to delete goal";
        setErrors({ submit: errorMessage });
        showError("Delete Failed", errorMessage);
      }
    } catch (error) {
      const errorMessage = "Failed to delete goal. Please try again.";
      setErrors({ submit: errorMessage });
      showError("Network Error", errorMessage);
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData({ ...editData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  if (loading) {
    return <GoalDetailsLoading />;
  }

  if (!goal) {
    return <GoalNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GoalDetailsHeader
          editing={editing}
          deleting={deleting}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        {/* Goal Content */}
        {editing ? (
          /* Edit Form */
          <EditGoalForm
            editData={editData}
            errors={errors}
            saving={saving}
            onInputChange={handleInputChange}
            onSave={handleSave}
            onCancel={handleCancelEdit}
          />
        ) : (
          <GoalDetailsView goal={goal} />
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Goal"
          message={
            <div>
              <p>Are you sure you want to delete this goal?</p>
              <p className="mt-2 font-medium text-gray-900">"{goal?.title}"</p>
              <p className="mt-2 text-red-600">This action cannot be undone.</p>
            </div>
          }
          confirmText="Delete Goal"
          cancelText="Cancel"
          type="danger"
          loading={deleting}
        />
      </div>
    </div>
  );
}
