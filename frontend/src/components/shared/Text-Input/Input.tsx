import styles from "./Input.module.css";
import type { InputHTMLAttributes } from "react";

type PropsType = InputHTMLAttributes<HTMLInputElement> & {
  fullwidth?: boolean;
};

const Input = ({ fullwidth, ...props }: PropsType) => {
  return (
    <input
      className={styles.input}
      style={{
        width: fullwidth ? "100%" : undefined,
      }}
      type="text"
      {...props} // Safe to spread now
    />
  );
};

export default Input;
