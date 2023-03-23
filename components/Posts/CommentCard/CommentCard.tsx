import { useEffect, useState } from "react";
import { CommentResponse } from "../../../models/Post";
import formatDate from "../../../utils/FormatDate";
import Avatar from "../../User/Avatar/Avatar";
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
        </div>
    );
};
export default CommentCard;
