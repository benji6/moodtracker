import "./style.css";
import { HtmlHTMLAttributes } from "react";

export default function PrevNextControls(
  props: HtmlHTMLAttributes<HTMLDivElement>,
) {
  return <div {...props} className="m-prev-next-controls" />;
}
