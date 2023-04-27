import styles from "./Likes.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
const Likes: React.FC<{
    onLikeHandler: () => void;
    likes?: number;
    likeStatus: boolean;
}> = (props) => {
    return (
        <div
            onClick={props.onLikeHandler}
            className={`
    ${styles["post-card__likes"]}
        ${
            props.likeStatus
                ? styles["post-card__likes__liked"]
                : styles["post-card__likes__disliked"]
        }
    `}
        >
            <FontAwesomeIcon icon={faPlus} />
            {props.likes ? props.likes : 0}
        </div>
    );
};
export default Likes;
