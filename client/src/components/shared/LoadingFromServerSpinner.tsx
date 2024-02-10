import { Spinner } from "eri";

export function LoadingFromServerSpinner() {
  return (
    <div className="center">
      <Spinner />
      Loading data from server...
    </div>
  );
}
