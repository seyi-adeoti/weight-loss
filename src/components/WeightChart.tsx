import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

export type WeightEntry = {
  date: string;
  weight: number;
};

type WeightChartProps = {
  entries: WeightEntry[];
};

function formatDate(dateKey: string) {
  const date = new Date(`${dateKey}T12:00:00`);
  return date.toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" });
}

export default function WeightChart({ entries }: WeightChartProps) {
  const data = {
    labels: entries.map((entry) => formatDate(entry.date)),
    datasets: [
      {
        label: "Weight (kg)",
        data: entries.map((entry) => entry.weight),
        borderColor: "#047857",
        backgroundColor: "rgba(16, 185, 129, 0.12)",
        pointBackgroundColor: "#047857",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const values = entries.map((entry) => entry.weight);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = Math.max((max - min) * 0.35, 0.5);
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: "index" },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => ` ${Number(context.parsed.y).toFixed(1)} kg`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b", maxRotation: 0, autoSkip: true },
      },
      y: {
        min: Math.max(0, Math.floor(min - padding)),
        max: Math.ceil(max + padding),
        grid: { color: "#e2e8f0" },
        ticks: {
          color: "#64748b",
          callback: (value) => `${value} kg`,
        },
      },
    },
  };

  return (
    <div
      aria-label={`Weight in kilograms during your ${entries.length} most recent weigh-ins. Exact values are listed in the check-in history below.`}
      className="h-72 w-full sm:h-80"
      role="img"
    >
      <Line data={data} options={options} />
    </div>
  );
}
