import { Button, ButtonGroup } from "@mui/material";
import React, { useState, useEffect, FunctionComponent } from "react";
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
        aria-label="outlined bg-backgroundLand button group"
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
        }}
      >
        <Button
          className="bg-backgroundLand"
          onClick={() => handleMouseWheelProp(true)}
        >
          <AddIcon />
        </Button>
        <Button onClick={() => handleMouseWheelProp(false)}>
          <RemoveIcon />
        </Button>
      </ButtonGroup>
    </>
  );
};

export default ZoomButtons;
