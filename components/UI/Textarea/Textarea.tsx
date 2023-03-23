import styles from "./Textarea.module.scss";
import { forwardRef } from "react";
const Textarea = forwardRef<
    HTMLTextAreaElement,
    { textarea?: {}; invalid?: boolean; className?: string }
>(
    (
        props: { textarea?: {}; invalid?: boolean; className?: string },
        ref: React.ForwardedRef<HTMLTextAreaElement>
    ) => {
        return (
            <textarea
                ref={ref}
                {...props.textarea}
                className={`${styles.textarea} ${
                    props.invalid ? styles.invalid : ""
                } ${props.className ? props.className : ""}`}
            ></textarea>
        );
    }
);
export default Textarea;
