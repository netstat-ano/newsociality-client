import styles from "./SuccessButton.module.scss";
const SuccessButton: React.FC<{
    children: string | JSX.Element;
    button?: {};
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
export default SuccessButton;
