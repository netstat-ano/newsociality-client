import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import styles from "./AnimatedContextMenu.module.scss";
import ContextMenu from "../ContextMenu/ContextMenu";
import useOutsideClick from "../../../hooks/use-outside-click";
const AnimatedContextMenu: React.FC<{ children: JSX.Element }> = (props) => {
    const [isOptionsVisable, setIsOptionsVisable] = useState<boolean>(false);
    const [isOptionsToggled, setIsOptionsToggled] = useState(false);
    const onToggleOptions = () => {
        if (!isOptionsVisable) {
            setIsOptionsVisable(true);
        }
        setIsOptionsToggled((prevState) => !prevState);
    };
    const ref = useOutsideClick(() => {
        setIsOptionsToggled(false);
    });
    return (
        <div ref={ref}>
            <FontAwesomeIcon
                className={styles["actions__options"]}
                onClick={onToggleOptions}
                icon={faEllipsis}
            />

            {isOptionsVisable && (
                <ContextMenu
                    isOptionsToggled={isOptionsToggled}
                    onAnimationEnd={() => {
                        if (!isOptionsToggled) {
                            setIsOptionsVisable(false);
                        }
                    }}
                    className={`
                                        ${styles["context-menu"]}
                                        ${
                                            isOptionsToggled
                                                ? styles["context-menu-show"]
                                                : styles["context-menu-hide"]
                                        }
                                        `}
                >
                    <>{props.children}</>
                </ContextMenu>
            )}
        </div>
    );
};
export default AnimatedContextMenu;
