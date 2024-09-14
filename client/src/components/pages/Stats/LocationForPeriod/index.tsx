import LocationMapForPeriod from "./LocationMapForPeriod";
import MoodByLocationForPeriod from "./MoodByLocationForPeriod";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function LocationForPeriod({ dateFrom, dateTo }: Props) {
  return (
    <>
      <MoodByLocationForPeriod dateFrom={dateFrom} dateTo={dateTo} />
      <LocationMapForPeriod dateFrom={dateFrom} dateTo={dateTo} />
    </>
  );
}
