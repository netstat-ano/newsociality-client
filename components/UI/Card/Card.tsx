import React from "react";
import styles from "./Card.module.scss";
interface IProps {
    children: JSX.Element;
    className?: string;
    div?: {};
}
const Card = React.forwardRef<HTMLDivElement, IProps>((props, ref) => {
    return (
        <div
            {...props.div}
            className={`${styles.card} ${
                props.className ? props.className : ""
            }`}
        >
            {props.children}
        </div>
    );
});
export default Card;
