import { Marker } from "react-simple-maps";

interface Props {
  latitude: number;
  longitude: number;
}

export default function LocationMarker({ latitude, longitude }: Props) {
  return (
    <Marker coordinates={[longitude, latitude]}>
      <g
        fill="none"
        stroke="var(--color-highlight-default)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        transform="translate(-12, -24)"
      >
        <circle cx="12" cy="10" r="3" />
        <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
      </g>
    </Marker>
  );
}
