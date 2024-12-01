import { utils, writeFile } from 'xlsx';
import type { Action } from '../types/action';
import type { ReportFilters } from '../types/report';
import { useMasterRecordsStore } from '../stores/masterRecordsStore';

export const exportToExcel = (actions: Action[], filters: ReportFilters, filename: string) => {
  // Get store data for reference lookups
  const { departments, families, objectives } = useMasterRecordsStore.getState();

  // Format data with filter context
  const data = actions.map(action => {
    // Get department names
    const departmentNames = action.departments
      .map(code => departments.find(d => d.code === code)?.name || code)
      .join(', ');

    // Get family names
    const familyNames = action.professionalFamilies
      .map(code => families.find(f => f.code === code)?.name || code)
      .join(', ');

    // Get objective names
    const objectiveNames = action.objectives
      .map(id => objectives.find(o => o.id === id)?.name || id)
      .join(', ');

    return {
      'Nombre': action.name,
      'Ubicación': action.location,
      'Descripción': action.description,
      'Fecha Inicio': action.startDate,
      'Fecha Fin': action.endDate,
      'Red': action.network,
      'Centro': action.center,
      'Trimestre': action.quarter,
      'Departamentos': departmentNames,
      'Familias Profesionales': familyNames,
      'Objetivos': objectiveNames,
      'Estudiantes': action.studentParticipants,
      'Profesores': action.teacherParticipants,
      'Total Participantes': action.studentParticipants + action.teacherParticipants,
      'Valoración': action.rating,
      'Comentarios': action.comments,
    };
  });

  // Create worksheet
  const ws = utils.json_to_sheet(data);

  // Add filter information
  const filterInfo = [
    ['Filtros Aplicados:'],
    ['Fecha Inicio:', filters.startDate || 'Todas'],
    ['Fecha Fin:', filters.endDate || 'Todas'],
    ['Red:', filters.network || 'Todas'],
    ['Centro:', filters.center || 'Todos'],
    ['Trimestre:', filters.quarter || 'Todos'],
    ['Departamento:', filters.department || 'Todos'],
    ['Familia Profesional:', filters.family || 'Todas'],
    ['Objetivos:', filters.objectives?.length ? 
      objectives
        .filter(o => filters.objectives?.includes(o.id))
        .map(o => o.name)
        .join(', ') : 
      'Todos'
    ],
    [],  // Empty row for spacing
  ];

  // Create a new workbook
  const wb = utils.book_new();

  // Add filter information sheet
  const wsFilters = utils.aoa_to_sheet(filterInfo);
  utils.book_append_sheet(wb, wsFilters, 'Filtros');

  // Add data sheet
  utils.book_append_sheet(wb, ws, 'Acciones');

  // Auto-size columns in both sheets
  const maxWidth = 50;
  const wsFiltersColWidths = filterInfo.reduce((acc: { [key: string]: number }, row) => {
    row.forEach((cell, i) => {
      const width = Math.min(maxWidth, String(cell).length + 2);
      acc[utils.encode_col(i)] = Math.max(acc[utils.encode_col(i)] || 0, width);
    });
    return acc;
  }, {});

  const wsColWidths = data.reduce((acc: { [key: string]: number }, row) => {
    Object.entries(row).forEach(([key, value], i) => {
      const width = Math.min(maxWidth, Math.max(String(key).length, String(value).length) + 2);
      acc[utils.encode_col(i)] = Math.max(acc[utils.encode_col(i)] || 0, width);
    });
    return acc;
  }, {});

  wsFilters['!cols'] = Object.entries(wsFiltersColWidths).map(([, width]) => ({ width }));
  ws['!cols'] = Object.entries(wsColWidths).map(([, width]) => ({ width }));

  // Write file
  writeFile(wb, `${filename}.xlsx`);
};