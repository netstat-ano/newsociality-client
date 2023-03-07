import styles from "./CanceledButton.module.scss";
const CanceledButton: React.FC<{
    button?: {};
    children: string | JSX.Element;
    className?: string;
}> = (props) => {
    return (
        <button
            {...props.button}
            className={`${styles.button} ${
                props.className ? props.className : ""
            }`}
        >
            {props.children}
        </button>
    );
};
export default CanceledButton;
