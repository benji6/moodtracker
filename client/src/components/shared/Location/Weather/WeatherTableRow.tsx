import { Icon } from "eri";
import { ComponentProps } from "react";

interface Props {
  displayValue: string;
  iconName: ComponentProps<typeof Icon>["name"];
  name: string;
  supportiveText?: string;
}

export default function WeatherTableRow({
  displayValue,
  iconName,
  name,
  supportiveText,
}: Props) {
  return (
    <tr>
      <td>
        <Icon margin="end" name={iconName} />
        {name}
        {supportiveText && (
          <small>
            <div>{supportiveText}</div>
          </small>
        )}
      </td>
      <td className="nowrap">{displayValue}</td>
    </tr>
  );
}
