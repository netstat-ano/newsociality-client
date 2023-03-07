import styles from "./InputErrorMessage.module.scss";
const InputErrorMessage: React.FC<{ message: string; className?: string }> = (
    props
) => {
    return (
        <div
            className={`${styles.error} ${
                props.className ? props.className : ""
            }`}
        >
            {props.message}
        </div>
    );
};
export default InputErrorMessage;
