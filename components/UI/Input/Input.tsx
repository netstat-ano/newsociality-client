import { forwardRef } from "react";
import styles from "./Input.module.scss";
const Input = forwardRef<
    HTMLInputElement,
    { input?: {}; className?: string; invalid: boolean }
>(
    (
        props: { input?: {}; className?: string; invalid: boolean },
        ref: React.ForwardedRef<HTMLInputElement>
    ) => {
        return (
            <input
                ref={ref}
                className={`${styles.input} ${
                    props.className ? props.className : ""
                } ${props.invalid ? styles.invalid : ""}`}
                {...props.input}
            ></input>
        );
    }
);
export default Input;
