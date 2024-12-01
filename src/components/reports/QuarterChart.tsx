import React from 'react';
import { BarChart, DonutChart } from '@tremor/react';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import type { Action } from '../../types/action';

interface QuarterChartProps {
  actions: Action[];
  type: 'bar' | 'pie';
}

const QuarterChart: React.FC<QuarterChartProps> = ({ actions, type }) => {
  const { activeYear } = useAcademicYearStore();
  const total = actions.length;
  const colors = ['orange', 'amber', 'yellow'];

  const data = activeYear?.quarters.map((quarter, index) => {
    const count = actions.filter(action => action.quarter === quarter.id).length;
    return {
      name: quarter.name,
      value: count,
      percentage: total > 0 ? (count / total) * 100 : 0,
      color: colors[index % colors.length],
    };
  }).filter(item => item.value > 0) || [];

  if (type === 'bar') {
    return (
      <div>
        <BarChart
          data={data}
          index="name"
          categories={['value']}
          colors={colors}
          valueFormatter={(value) => value.toLocaleString()}
          yAxisWidth={48}
          className="h-72"
        />
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full bg-${item.color}-500`} />
                <span>{item.name}</span>
              </div>
              <span>{item.value.toLocaleString()} ({item.percentage.toFixed(1)}%)</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <DonutChart
        data={data}
        index="name"
        category="value"
        colors={colors}
        className="h-72"
        showAnimation={true}
        showTooltip={false}
      />
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full bg-${item.color}-500`} />
              <span>{item.name}</span>
            </div>
            <span>{item.value.toLocaleString()} ({item.percentage.toFixed(1)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuarterChart;