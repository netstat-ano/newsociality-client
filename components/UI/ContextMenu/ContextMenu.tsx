import styles from "./ContextMenu.module.scss";
const ContextMenu: React.FC<{ children: JSX.Element }> = (props) => {
    return (
        <div className={styles["context-menu"]}>
            <ul>{props.children}</ul>
        </div>
    );
};
export default ContextMenu;
