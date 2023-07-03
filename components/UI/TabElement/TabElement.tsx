import styles from "./TabElement.module.scss";
const TabElement: React.FC<{ children: JSX.Element | string }> = (props) => {
    return <li className={styles.tab}>{props.children}</li>;
};
export default TabElement;
