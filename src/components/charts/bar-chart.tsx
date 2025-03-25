"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface BarChartProps {
  title: string;
  description?: string;
  data: any[];
  dataKey: string;
  xAxisKey?: string;
  categories?: string[];
  colors?: string[];
  height?: number;
  variant?: "default" | "brutal" | "pixel" | "outline" | "flat";
}

export function BarChartComponent({
  title,
  description,
  data,
  dataKey,
  xAxisKey = "name",
  categories = [dataKey],
  colors = ["#16a34a", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6"],
  height = 300,
  variant = "outline",
}: BarChartProps) {
  return (
    <Card variant={variant} className={variant === "outline" ? "border-2" : ""}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
            <XAxis 
              dataKey={xAxisKey} 
              className="text-xs font-medium text-muted-foreground" 
              tick={{ fill: 'currentColor', angle: -45, textAnchor: 'end', dy: 10 }}
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
              align="center"
              verticalAlign="bottom"
            />
            {categories.map((category, index) => (
              <Bar 
                key={category}
                dataKey={category}
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 