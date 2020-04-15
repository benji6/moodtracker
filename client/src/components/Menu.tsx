import { Menu as EriMenu } from "eri";
import * as React from "react";

interface Props {
  open: boolean;
  handleMenuClose(): void;
}

export default function Menu({ handleMenuClose, open }: Props) {
  return (
    <>
      <EriMenu onClose={handleMenuClose} open={open}>
        <EriMenu.List>
          <EriMenu.Link onClick={handleMenuClose} to="/">
            Home
          </EriMenu.Link>
          <EriMenu.Link onClick={handleMenuClose} to="/add">
            Add mood
          </EriMenu.Link>
          <EriMenu.Link onClick={handleMenuClose} to="about">
            About
          </EriMenu.Link>
          <EriMenu.Link onClick={handleMenuClose} to="see-also">
            See also
          </EriMenu.Link>
        </EriMenu.List>
      </EriMenu>
    </>
  );
}
