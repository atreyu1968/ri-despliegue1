import React, { useState } from 'react';
import { Download, Filter } from 'lucide-react';
import { useActionsStore } from '../stores/actionsStore';
import { useAuthStore } from '../stores/authStore';
import ReportFilters from '../components/reports/ReportFilters';
import ReportDataTable from '../components/reports/ReportDataTable';
import ReportCharts from '../components/reports/ReportCharts';
import { exportToExcel } from '../utils/exportUtils';
import type { ReportFilters as FilterType } from '../types/report';

const Reports = () => {
  const { actions } = useActionsStore();
  const { user } = useAuthStore();
  const [filters, setFilters] = useState<FilterType>({});
  const [showCharts, setShowCharts] = useState(true);

  // Filter actions based on user role and permissions
  const accessibleActions = React.useMemo(() => {
    if (!user) return [];

    // Admin and general coordinator can see all actions
    if (user.role === 'admin' || user.role === 'general_coordinator') {
      return actions;
    }

    // Subnet coordinator can only see actions from their network
    if (user.role === 'subnet_coordinator') {
      return actions.filter(action => action.network === user.network);
    }

    // Manager can only see actions from their center
    if (user.role === 'manager') {
      return actions.filter(action => action.center === user.center);
    }

    return [];
  }, [actions, user]);

  const filteredActions = accessibleActions.filter(action => {
    if (filters.startDate && action.startDate < filters.startDate) return false;
    if (filters.endDate && action.endDate > filters.endDate) return false;
    if (filters.network && action.network !== filters.network) return false;
    if (filters.center && action.center !== filters.center) return false;
    if (filters.quarter && action.quarter !== filters.quarter) return false;
    if (filters.department && !action.departments.includes(filters.department)) return false;
    if (filters.family && !action.professionalFamilies.includes(filters.family)) return false;
    if (filters.objectives?.length > 0 && !filters.objectives.some(obj => action.objectives.includes(obj))) return false;
    return true;
  });

  const handleExport = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    exportToExcel(
      filteredActions,
      filters,
      `reporte_acciones_${timestamp}`
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          {user?.role === 'manager' ? 'Informe del Centro' :
           user?.role === 'subnet_coordinator' ? 'Informe de la Red' :
           'Informes Generales'}
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowCharts(!showCharts)}
            className="px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
          >
            {showCharts ? 'Ver Tablas' : 'Ver Gráficos'}
          </button>
          <button
            onClick={() => (document.getElementById('filters-dialog') as HTMLDialogElement)?.showModal()}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-5 h-5" />
            <span>Filtros</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Download className="w-5 h-5" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {showCharts ? (
        <ReportCharts actions={filteredActions} />
      ) : (
        <ReportDataTable 
          actions={filteredActions}
          showNetworkReports={user?.role === 'admin' || user?.role === 'general_coordinator'}
          userNetwork={user?.network}
          userCenter={user?.center}
        />
      )}

      <ReportFilters
        filters={filters}
        onFiltersChange={setFilters}
        userRole={user?.role}
        userNetwork={user?.network}
        userCenter={user?.center}
      />
    </div>
  );
};

export default Reports;