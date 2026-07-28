import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";

const RadarChartComponent = ({ data }) => {
  return (
    <div className="w-full h-full min-h-[300px]">
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#d4c3b9" />
            <PolarAngleAxis dataKey="category" tick={{ fill: "#50443d", fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: "#82746c", fontSize: 10 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#d4c3b9', borderRadius: '4px' }}
              formatter={(value, name) => {
                if (name === "totalRevenue") return [`₹${value.toLocaleString()}`, "Revenue"];
                if (name === "totalOrders") return [value, "Orders"];
                return [value, name];
              }}
            />
            <Radar
              name="totalRevenue"
              dataKey="totalRevenue"
              stroke="#8b6447"
              fill="#8b6447"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-on-surface-variant text-sm">
          No category data available.
        </div>
      )}
    </div>
  );
};

export default RadarChartComponent;
