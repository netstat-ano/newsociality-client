import styles from "./DisabledButton.module.scss";
const DisabledButton: React.FC<{ children: string | JSX.Element }> = (
    props
) => {
    return (
        <button className={styles["disabled-button"]}>{props.children}</button>
    );
};
export default DisabledButton;
