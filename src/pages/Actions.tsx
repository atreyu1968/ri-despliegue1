import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useActionsStore } from '../stores/actionsStore';
import { useAcademicYearStore } from '../stores/academicYearStore';
import { useAuthStore } from '../stores/authStore';
import ActionList from '../components/actions/ActionList';
import ActionForm from '../components/actions/ActionForm';
import { mockActions } from '../data/mockActions';
import type { Action } from '../types/action';

const Actions = () => {
  const { actions, setActions, addAction, updateAction, deleteAction } = useActionsStore();
  const { activeYear } = useAcademicYearStore();
  const { user } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [editingAction, setEditingAction] = useState<Action | null>(null);

  useEffect(() => {
    setActions(mockActions);
  }, [setActions]);

  const handleEdit = (action: Action) => {
    setEditingAction(action);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar esta acción?')) {
      deleteAction(id);
    }
  };

  const handleSubmit = (data: Omit<Action, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingAction) {
      updateAction(editingAction.id, data);
    } else {
      addAction(data);
    }
    setShowForm(false);
    setEditingAction(null);
  };

  const canEditAction = (action: Action) => {
    if (user?.role === 'admin') return true;
    if (!activeYear) return false;

    const quarter = activeYear.quarters.find(q => q.id === action.quarter);
    if (!quarter?.isActive) return false;

    if (user?.role === 'general_coordinator') return true;
    if (user?.role === 'subnet_coordinator' && action.network === user.network) return true;
    return action.createdBy === user?.id;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Acciones</h1>
        <button
          onClick={() => {
            setEditingAction(null);
            setShowForm(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Acción</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <ActionList
            actions={actions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            canEdit={canEditAction}
          />
        </div>
      </div>

      {showForm && (
        <ActionForm
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingAction(null);
          }}
          initialData={editingAction}
        />
      )}
    </div>
  );
};

export default Actions;