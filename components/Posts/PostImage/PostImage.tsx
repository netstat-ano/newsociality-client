import styles from "./PostImage.module.scss";
const PostImage: React.FC<{ src: string }> = (props) => {
    return (
        <img
            className={styles["post-image"]}
            src={`${process.env.API_URL}${props.src}`}
        ></img>
    );
};
export default PostImage;
