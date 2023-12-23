import "./style.css";
import { ReactNode } from "react";

interface Props {
  data: [string, ReactNode][];
}

export default function UsageTable({ data }: Props) {
  return (
    <table className="m-usage-table">
      <thead>
        <tr>
          <th>Stat</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {data.map(([k, v]) => (
          <tr key={k}>
            <td>{k}</td>
            {typeof v === "object" ? v : <td>{v}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
