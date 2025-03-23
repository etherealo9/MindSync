"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface LineChartProps {
  title: string;
  description?: string;
  data: any[];
  dataKey: string;
  xAxisKey?: string;
  categories?: string[];
  colors?: string[];
  height?: number;
  variant?: "default" | "brutal" | "pixel" | "outline" | "flat";
  showDots?: boolean;
}

export function LineChartComponent({
  title,
  description,
  data,
  dataKey,
  xAxisKey = "name",
  categories = [dataKey],
  colors = ["#16a34a", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6"],
  height = 300,
  variant = "outline",
  showDots = true,
}: LineChartProps) {
  return (
    <Card variant={variant} className={variant === "outline" ? "border-2" : ""}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey={xAxisKey} 
              className="text-xs font-medium text-muted-foreground" 
              tick={{ fill: 'currentColor' }}
              tickLine={{ stroke: 'currentColor' }}
            />
            <YAxis 
              className="text-xs font-medium text-muted-foreground" 
              tick={{ fill: 'currentColor' }}
              tickLine={{ stroke: 'currentColor' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--background)', 
                borderColor: 'var(--border)',
                borderRadius: '0px',
                boxShadow: 'var(--shadow-sm)'
              }} 
              labelStyle={{
                color: 'var(--foreground)',
                fontWeight: 'bold',
                marginBottom: '4px'
              }}
            />
            <Legend 
              iconType="circle" 
              wrapperStyle={{
                paddingTop: '10px',
                fontSize: '12px'
              }}
            />
            {categories.map((category, index) => (
              <Line 
                key={category}
                type="monotone"
                dataKey={category}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={showDots ? { stroke: colors[index % colors.length], strokeWidth: 2, r: 4 } : false}
                activeDot={{ r: 6, stroke: colors[index % colors.length], strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 