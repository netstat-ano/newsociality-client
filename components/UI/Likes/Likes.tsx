import styles from "./Likes.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
const Likes: React.FC<{
    onLikeHandler: () => void;
    likes?: number;
    likeStatus: boolean;
}> = (props) => {
    const [beat, setBeat] = useState(false);
    const onLike = () => {
        props.onLikeHandler();
        setBeat(true);
    };
    return (
        <div
            data-testid="like"
            onClick={onLike}
            className={`
    ${styles["post-card__likes"]}
        ${
            props.likeStatus
                ? styles["post-card__likes__liked"]
                : styles["post-card__likes__disliked"]
        }
    `}
        >
            <div
                className={` ${beat ? styles["beat"] : ""}`}
                onAnimationEnd={() => {
                    setBeat(false);
                }}
            >
                <FontAwesomeIcon icon={faPlus} />
                {props.likes ? props.likes : 0}
            </div>
        </div>
    );
};
export default Likes;
