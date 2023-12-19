import { formatDistanceToNow } from "date-fns";
import { BUILD_TIME } from "../../constants";

export default function Version() {
  return (
    <p>
      The version you&apos;re currently using was last updated{" "}
      <b>{formatDistanceToNow(new Date(BUILD_TIME))} ago</b>.
    </p>
  );
}
