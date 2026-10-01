import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { VoteHistory } from "../../types";

interface Props {
  data: VoteHistory[];
}

export default function VoteChart({ data }: Props) {
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString(),
    votes: item.votes,
  }));

  return (
    <div className="h-80 w-full rounded-2xl bg-white p-4 shadow">
      <h2 className="mb-4 text-xl font-semibold text-slate-800">
        Vote Progress
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="votes"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
