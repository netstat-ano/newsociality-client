import { useEffect, useState } from "react";
import { CommentResponse } from "../../../models/Post";
import formatDate from "../../../utils/formatDate";
import Avatar from "../../User/Avatar/Avatar";
import PostImage from "../PostImage/PostImage";
import styles from "./CommentCard.module.scss";
const CommentCard: React.FC<{ comment: CommentResponse }> = (props) => {
    const [formattedDate, setFormattedDate] = useState("");
    useEffect(() => {
        if (props.comment.createdAt) {
            setFormattedDate(formatDate(props.comment.createdAt));
        }
    }, []);
    return (
        <div className={styles["comment-card"]}>
            <div className={`center ${styles["comment-card__user__avatar"]}`}>
                <Avatar
                    src={`${process.env.API_URL}/${props.comment.userId.avatarUrl}`}
                />
            </div>
            <div>
                <div>{props.comment.userId.username}</div>
                <div className={styles["comment-card__user_date"]}>
                    {formattedDate}
                </div>
            </div>
            <div></div>
            <div> {props.comment.commentText}</div>
            <div></div>
            <div className={styles["comment-card__imageUrl"]}>
                {props.comment.imageUrl && (
                    <PostImage src={props.comment.imageUrl} />
                )}
            </div>
        </div>
    );
};
export default CommentCard;
