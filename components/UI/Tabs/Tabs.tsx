import styles from "./Tabs.module.scss";
const Tabs: React.FC<{ children: JSX.Element | JSX.Element[] }> = (props) => {
    return <ul className={styles["tabs"]}>{props.children}</ul>;
};
export default Tabs;
