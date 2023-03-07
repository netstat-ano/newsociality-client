import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import styles from "./Sidebar.module.scss";
const Sidebar: React.FC<{}> = () => {
    const [isSidebarToggled, setIsSidebarToggled] = useState(false);
    const toggleSidebarHandler = () => {
        setIsSidebarToggled((state) => !state);
    };
    return (
        <div className={styles.sidebar}>
            <div>
                <FontAwesomeIcon
                    className={styles["sidebar__bars"]}
                    onClick={toggleSidebarHandler}
                    icon={faBars}
                />
            </div>
            <nav>
                {isSidebarToggled && (
                    <ul>
                        <li>Ciekawostki</li>
                        <li>Technologia</li>
                    </ul>
                )}
            </nav>
        </div>
    );
};
export default Sidebar;
