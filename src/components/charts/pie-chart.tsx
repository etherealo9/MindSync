"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface PieChartProps {
  title: string;
  description?: string;
  data: Array<{ name: string; value: number }>;
  colors?: string[];
  height?: number;
  variant?: "default" | "brutal" | "pixel" | "outline" | "flat";
  innerRadius?: number;
  outerRadius?: number;
}

interface PieLabel {
  name: string;
  percent: number;
}

export function PieChartComponent({
  title,
  description,
  data,
  colors = ["#16a34a", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#a855f7"],
  height = 300,
  variant = "outline",
  innerRadius = 0,
  outerRadius = 80,
}: PieChartProps) {
  return (
    <Card variant={variant} className={variant === "outline" ? "border-2" : ""}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={Math.min(outerRadius, height / 3)}
              innerRadius={Math.min(innerRadius, height / 4)}
              paddingAngle={innerRadius > 0 ? 5 : 0}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }: PieLabel) => 
                window.innerWidth > 640 ? `${name}: ${(percent * 100).toFixed(0)}%` : `${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--background)', 
                borderColor: 'var(--border)',
                borderRadius: '0px',
                boxShadow: 'var(--shadow-sm)'
              }} 
              formatter={(value: number, name: string) => [value, name]}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '12px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 