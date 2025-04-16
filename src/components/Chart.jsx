import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format } from "date-fns";

const ServerChart = ({ data }) => {
  // Tablodan gelen verileri grafik formatına çeviriyoruz.
  const chartData = data.map(item => ({
    // Tablonun DELETED_AT sütunundan tarih verisini alıyoruz.
    deleted_at: item.DELETED_AT,
    core: Number(item.CORE),
    memory: Number(item.MEMORY /1024 )
  }));

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <BarChart
          data={servers}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          
          <XAxis 
            dataKey="deleted_at"
            tickFormatter={(tick) => {
              const date = new Date(tick);
              return isNaN(date) ? "" : format(date, "dd/MM/yyyy");
            }}
          />
          <YAxis />
          
          <Tooltip 
            labelFormatter={(label) => {
              const date = new Date(label);
              return isNaN(date) ? "" : format(date, "dd/MM/yyyy");
            }}
          />
          <Legend />
          
          <Bar dataKey="core" fill="#8884d8" name="Çekirdek Sayısı" />
          <Bar dataKey="memory" fill="#82ca9d" name="Bellek (GB)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ServerChart;