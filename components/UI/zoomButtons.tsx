import { Button, ButtonGroup } from "@mui/material";
import React, { FunctionComponent } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

type ZoomButtonsProps = {
  handleMouseWheelProp: (e: boolean) => void;
};

const ZoomButtons: FunctionComponent<ZoomButtonsProps> = ({
  handleMouseWheelProp,
}) => {
  return (
    <>
      <ButtonGroup
        variant="contained"
        aria-label="outlined button group"
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          backgroundColor: "#1a1528",
          borderColor: "#1a1528",
        }}
      >
        <Button
          style={{
            backgroundColor: "#1a1528",
            borderColor: "#1a1528",
          }}
          variant="contained"
          onClick={() => handleMouseWheelProp(true)}
        >
          <AddIcon />
        </Button>
        <Button
          style={{
            backgroundColor: "#1a1528",
            borderColor: "#1a1528",
          }}
          variant="contained"
          onClick={() => handleMouseWheelProp(false)}
        >
          <RemoveIcon />
        </Button>
      </ButtonGroup>
    </>
  );
};

export default ZoomButtons;
