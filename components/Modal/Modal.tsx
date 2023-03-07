import ReactDOM from "react-dom";
import styles from "./Modal.module.scss";

const Modal: React.FC<{
    children: string | JSX.Element;
    colorsScheme: string;
}> = (props) => {
    let classes = `${styles.modal}`;
    if (props.colorsScheme === "error") {
        classes += ` ${styles.error}`;
    } else if (props.colorsScheme === "success") {
        classes += ` ${styles.success}`;
    }
    return <div className={classes}>{props.children}</div>;
};
const ModalPortal: React.FC<{
    children: string | JSX.Element;
    colorsScheme: string;
}> = (props) => {
    return ReactDOM.createPortal(
        <Modal colorsScheme={props.colorsScheme}>{props.children}</Modal>,
        document.getElementById("modal-root") as HTMLElement
    );
};
export default ModalPortal;
