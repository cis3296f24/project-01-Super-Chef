import { CSSProperties } from "react";
import styles from "./button.module.css";
const Button = ({
    text,
    onClick,
    style,
}: {
    text: string;
    onClick: () => any;
    style?: CSSProperties;
}) => {
    return (
        <button
            className={styles.button}
            onClick={onClick}
            style={{ ...style }}
        >
            {text}
        </button>
    );
};

export default Button;
