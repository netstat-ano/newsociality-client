import styles from "./Card.module.scss";
const Card: React.FC<{
    children: JSX.Element;
    className?: string;
    div?: {};
}> = (props) => {
    return (
        <div
            {...props.div}
            className={`${styles.card} ${
                props.className ? props.className : ""
            }`}
        >
            {props.children}
        </div>
    );
};
export default Card;
