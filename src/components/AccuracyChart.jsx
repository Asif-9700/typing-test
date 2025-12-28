import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

function AccuracyChart({ labels, data }) {
  return (
    <div className="chart">
      <Line
        data={{
          labels,
          datasets: [
            {
              label: "Accuracy %",
              data,
              borderColor: "#0d6efd",
              tension: 0.3,
            },
          ],
        }}
      />
    </div>
  );
}

export default AccuracyChart;
