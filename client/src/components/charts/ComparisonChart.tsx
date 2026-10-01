import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Candidate } from "../../types";

interface Props {
  candidates: Candidate[];
}

interface ChartRow {
  date: string;
  [key: string]: string | number;
}

export default function CategoryComparisonChart({ candidates }: Props) {
  const allDates = Array.from(
    new Set(
      candidates.flatMap((candidate) =>
        candidate.voteHistory.map((entry) =>
          new Date(entry.date).toLocaleDateString(),
        ),
      ),
    ),
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const chartData: ChartRow[] = allDates.map((date) => {
    const row: ChartRow = { date };

    candidates.forEach((candidate) => {
      const matchingHistory = candidate.voteHistory.find(
        (entry) => new Date(entry.date).toLocaleDateString() === date,
      );

      row[candidate.name] = matchingHistory ? matchingHistory.votes : 0;
    });

    return row;
  });

  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-50 p-8 text-center">
        <p className="text-slate-500">No vote history available yet.</p>
      </div>
    );
  }

  return (
    <div className="h-[420px] w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          {candidates.map((candidate) => (
            <Line
              key={candidate._id}
              type="monotone"
              dataKey={candidate.name}
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
