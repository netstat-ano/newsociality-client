import styles from "./Card.module.scss";
const Card: React.FC<{ children: JSX.Element; className?: string }> = (
    props
) => {
    return (
        <div
            className={`${styles.card} ${
                props.className ? props.className : ""
            }`}
        >
            {props.children}
        </div>
    );
};
export default Card;
