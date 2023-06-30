import styles from "./ContextMenu.module.scss";
import { useState } from "react";
const ContextMenu: React.FC<{
    children: JSX.Element;
    className?: string;
    onAnimationEnd?: () => void;
    isOptionsToggled?: boolean;
}> = (props) => {
    const onAnimationEnd = () => {
        if (props.onAnimationEnd) {
            props.onAnimationEnd();
        }
    };

    return (
        <div
            onAnimationEnd={onAnimationEnd}
            className={`${styles["context-menu"]} ${
                props.className ? props.className : ""
            }`}
        >
            <ul>{props.children}</ul>
        </div>
    );
};
export default ContextMenu;
