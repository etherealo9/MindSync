"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface AreaChartProps {
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

export function AreaChartComponent({
  title,
  description,
  data,
  dataKey,
  xAxisKey = "name",
  categories = [dataKey],
  colors = ["#16a34a", "#6366f1", "#f59e0b"],
  height = 300,
  variant = "default",
}: AreaChartProps) {
  return (
    <Card variant={variant} className={variant === "outline" ? "border-2" : ""}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              {categories.map((category, index) => (
                <linearGradient key={category} id={`color-${category}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
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
                borderRadius: '4px',
                boxShadow: 'var(--shadow-sm)'
              }} 
              labelStyle={{
                color: 'var(--foreground)',
                fontWeight: 'bold',
                marginBottom: '4px'
              }}
            />
            {categories.map((category, index) => (
              <Area
                key={category}
                type="monotone"
                dataKey={category}
                fill={`url(#color-${category})`}
                stroke={colors[index % colors.length]}
                fillOpacity={1}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 