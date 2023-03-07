import styles from "./BlueButton.module.scss";
const BlueButton: React.FC<{
    children: string;
    className?: string;
    button?: {};
}> = (props) => {
    return (
        <button
            {...props.button}
            className={`${props.className ? props.className : ""} ${
                styles.button
            }`}
        >
            {props.children}
        </button>
    );
};
export default BlueButton;
