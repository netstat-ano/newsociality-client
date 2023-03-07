import styles from "./Wrapper.module.scss";
const Wrapper: React.FC<{ children: JSX.Element }> = (props) => {
    return <main className={styles.main}>{props.children}</main>;
};
export default Wrapper;
