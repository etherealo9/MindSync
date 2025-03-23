declare module 'recharts' {
  import * as React from 'react';

  export interface AreaProps {
    type?: string;
    dataKey: string;
    stroke?: string;
    fill?: string;
    fillOpacity?: number;
    stackId?: string;
    connectNulls?: boolean;
  }

  export interface BarProps {
    dataKey: string;
    fill?: string;
    stroke?: string;
    radius?: number | number[];
    barSize?: number;
  }

  export interface PieProps {
    data: Array<any>;
    dataKey: string;
    nameKey?: string;
    cx?: string | number;
    cy?: string | number;
    startAngle?: number;
    endAngle?: number;
    innerRadius?: number;
    outerRadius?: number;
    paddingAngle?: number;
    label?: boolean | Function | React.ReactElement;
    labelLine?: boolean | Function | React.ReactElement;
    children?: React.ReactNode;
  }

  export interface LineProps {
    type?: string;
    dataKey: string;
    stroke?: string;
    fill?: string;
    strokeWidth?: number;
    dot?: boolean | React.ReactElement | Function | object;
    activeDot?: boolean | React.ReactElement | Function | object;
  }

  export interface CellProps {
    fill?: string;
    stroke?: string;
  }

  export interface CartesianGridProps {
    horizontal?: boolean;
    vertical?: boolean;
    strokeDasharray?: string;
    className?: string;
  }

  export interface XAxisProps {
    dataKey?: string;
    tick?: boolean | React.ReactElement | Function | object;
    tickLine?: boolean | React.ReactElement | Function | object;
    className?: string;
  }

  export interface YAxisProps {
    tick?: boolean | React.ReactElement | Function | object;
    tickLine?: boolean | React.ReactElement | Function | object;
    className?: string;
  }

  export interface TooltipProps {
    contentStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    formatter?: Function;
  }

  export interface LegendProps {
    layout?: 'horizontal' | 'vertical';
    verticalAlign?: 'top' | 'middle' | 'bottom';
    align?: 'left' | 'center' | 'right';
    iconType?: 'line' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye';
    wrapperStyle?: React.CSSProperties;
  }

  export interface ResponsiveContainerProps {
    width?: string | number;
    height?: string | number;
    minWidth?: string | number;
    minHeight?: string | number;
    children?: React.ReactNode;
  }

  export const Area: React.FC<AreaProps>;
  export const Bar: React.FC<BarProps>;
  export const Pie: React.FC<PieProps>;
  export const Cell: React.FC<CellProps>;
  export const Line: React.FC<LineProps>;
  export const CartesianGrid: React.FC<CartesianGridProps>;
  export const XAxis: React.FC<XAxisProps>;
  export const YAxis: React.FC<YAxisProps>;
  export const Tooltip: React.FC<TooltipProps>;
  export const Legend: React.FC<LegendProps>;

  export class AreaChart extends React.Component<any, any> {}
  export class BarChart extends React.Component<any, any> {}
  export class LineChart extends React.Component<any, any> {}
  export class PieChart extends React.Component<any, any> {}
  export class ResponsiveContainer extends React.Component<ResponsiveContainerProps, any> {}
} 