import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function PerformanceChart({
  data,
  studentName
}) {

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {studentName}
        </h2>
        <p className="text-gray-500 mt-1">
          Performance by Event
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          {/* X Axis */}
          <XAxis dataKey="event_title" />
          {/* Y Axis */}
          <YAxis />
          {/* Tooltip */}
          <Tooltip />
          {/* Line */}
          <Line dataKey="percentage" stroke="#2563eb" strokeWidth={3} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}