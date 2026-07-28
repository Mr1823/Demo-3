import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const BarChartComponent = ({ data }) => {
  return (
    <div className="w-full h-full min-h-[300px]">
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d4c3b9" />
            <XAxis dataKey="period" tick={{ fill: "#50443d", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#50443d", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value.toLocaleString()}`} />
            <Tooltip 
              cursor={{ fill: '#fcf2e3' }}
              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#d4c3b9', borderRadius: '4px' }}
              formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
            />
            <Bar dataKey="totalRevenue" fill="#704c31" radius={[4, 4, 0, 0]} maxBarSize={50} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-on-surface-variant text-sm">
          No revenue data available.
        </div>
      )}
    </div>
  );
};

export default BarChartComponent;
