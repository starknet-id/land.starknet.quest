import React, { FunctionComponent, ReactNode } from "react";
import styles from "../../../styles/components/modal.module.css";

type ButtonProps = {
  onClick?: () => void;
  children?: string | ReactNode;
  disabled?: boolean;
  color?: string;
  width?: number;
};

const PixelModal: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  color = "primary",
  width = 0,
}) => {
  return (
    <div
      className={styles.svgBorder}
      style={{ width: `${width ? width + "px" : "auto"} ` }}
    >
      <div>{children}</div>
    </div>
  );
};

export default PixelModal;
