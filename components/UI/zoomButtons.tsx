import { Slider } from "@mui/material";
import React, { FunctionComponent, useState } from "react";
import { styled } from "@mui/material/styles";

type ZoomButtonsProps = {
  updateZoomIndex: (newValue: number) => void;
};

const ZoomButtons: FunctionComponent<ZoomButtonsProps> = ({
  updateZoomIndex,
}) => {
  const [value, setValue] = useState<number>(15);

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number" && newValue !== value) {
      updateZoomIndex(newValue);
      setValue(newValue);
    }
  };

  const ZoomSlider = styled(Slider)(({ theme }) => ({
    color: "#E1DCEA",
    height: 2,
    // width: 650,
    width: "80%",
    maxWidth: "850px",
    margin: "auto",
    position: "absolute",
    left: "50%",
    transform: "translate(-50%, 0)",
    bottom: "40px",
    "& .MuiSlider-track": {
      border: "none",
    },
    "& .MuiSlider-thumb": {
      height: 18,
      width: 18,
      backgroundColor: "#E1DCEA",
      border: "2px solid currentColor",
      "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
        boxShadow: "inherit",
      },
      "&:before": {
        display: "none",
      },
    },
  }));

  return (
    <Slider
      value={value}
      min={8}
      step={1}
      max={25}
      defaultValue={15}
      onChange={handleChange}
      aria-labelledby="non-linear-slider"
      sx={{
        color: "#E1DCEA",
        height: 2,
        // width: 650,
        width: "80%",
        maxWidth: "850px",
        margin: "auto",
        position: "absolute",
        left: "50%",
        transform: "translate(-50%, 0)",
        bottom: "40px",
      }}
    />
  );
};

export default ZoomButtons;
