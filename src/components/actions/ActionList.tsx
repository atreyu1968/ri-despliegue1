import React from 'react';
import { Pencil, Trash2, MapPin, Calendar, Users, Star, Clock, Image as ImageIcon, FileText, ExternalLink, Network } from 'lucide-react';
import type { Action } from '../../types/action';
import { useAuthStore } from '../../stores/authStore';
import { useMasterRecordsStore } from '../../stores/masterRecordsStore';
import { useAcademicYearStore } from '../../stores/academicYearStore';

interface ActionListProps {
  actions: Action[];
  onEdit: (action: Action) => void;
  onDelete: (id: string) => void;
  canEdit: (action: Action) => boolean;
}

const ActionList: React.FC<ActionListProps> = ({ actions, onEdit, onDelete, canEdit }) => {
  const { departments, families, networks } = useMasterRecordsStore();
  const { users } = useAuthStore();
  const { activeYear } = useAcademicYearStore();

  const formatDate = (date: string) => new Date(date).toLocaleDateString('es-ES');

  const getDepartmentNames = (codes: string[]) => {
    return codes
      .map(code => departments.find(d => d.code === code)?.name || code)
      .join(', ');
  };

  const getFamilyNames = (codes: string[]) => {
    return codes
      .map(code => families.find(f => f.code === code)?.name || code)
      .join(', ');
  };

  const getCreatorName = (userId: string) => {
    const user = users?.find(u => u.id === userId);
    return user ? `${user.name} ${user.lastName}` : 'Usuario desconocido';
  };

  const getQuarterName = (quarterId: string) => {
    const quarter = activeYear?.quarters.find(q => q.id === quarterId);
    return quarter?.name || 'Trimestre no encontrado';
  };

  const getNetworkName = (networkCode: string) => {
    const network = networks.find(n => n.code === networkCode);
    return network?.name || networkCode;
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      {actions.map((action) => (
        <div key={action.id} className="bg-white border rounded-lg shadow-sm hover:shadow transition-shadow">
          <div className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{action.name}</h3>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{action.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    <Network className="w-4 h-4 mr-1" />
                    <span>{getNetworkName(action.network)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {(action.imageUrl || action.documentUrl) && (
                  <div className="flex space-x-2">
                    {action.imageUrl && (
                      <button
                        onClick={() => openInNewTab(action.imageUrl!)}
                        className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
                        title="Ver imagen"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                    )}
                    {action.documentUrl && (
                      <button
                        onClick={() => openInNewTab(action.documentUrl!)}
                        className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
                        title={`Ver documento${action.documentName ? `: ${action.documentName}` : ''}`}
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
                
                {canEdit(action) && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(action)}
                      className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(action.id)}
                      className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{formatDate(action.startDate)} - {formatDate(action.endDate)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{getQuarterName(action.quarter)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  <span>
                    {action.studentParticipants} estudiantes, {action.teacherParticipants} profesores
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end text-sm text-gray-600 mb-2">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  <span>Valoración: {action.rating}/5</span>
                </div>
                <div className="text-sm text-gray-500">
                  Creado por: {getCreatorName(action.createdBy)}
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              {action.description}
            </div>

            <div className="border-t pt-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-700">Departamentos:</span>
                  <span className="ml-2 text-gray-600">{getDepartmentNames(action.departments)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Familias Profesionales:</span>
                  <span className="ml-2 text-gray-600">{getFamilyNames(action.professionalFamilies)}</span>
                </div>
              </div>
            </div>

            {action.comments && (
              <div className="border-t mt-4 pt-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-700">Comentarios:</span>{' '}
                  {action.comments}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}

      {actions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No hay acciones registradas
        </div>
      )}
    </div>
  );
};

export default ActionList;