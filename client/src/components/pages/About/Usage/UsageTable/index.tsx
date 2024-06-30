import "./style.css";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function UsageTable({ children }: Props) {
  return (
    <table className="m-usage-table">
      <thead>
        <tr>
          <th>Stat</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
