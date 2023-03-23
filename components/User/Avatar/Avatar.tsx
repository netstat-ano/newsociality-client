import styles from "./Avatar.module.scss";
const Avatar: React.FC<{ src: string; img?: {} }> = (props) => {
    return <img {...props.img} className={styles.avatar} src={props.src}></img>;
};
export default Avatar;
