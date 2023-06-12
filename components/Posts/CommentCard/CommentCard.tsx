import { useEffect, useState } from "react";
import formatDate from "../../../utils/formatDate";
import Avatar from "../../User/Avatar/Avatar";
import PostImage from "../PostImage/PostImage";
import styles from "./CommentCard.module.scss";
import CommentDB from "../../../models/CommentDB";
import useAlert from "../../../hooks/use-alert";
import Likes from "../../UI/Likes/Likes";
import ModalPortal from "../../Modal/Modal";
import { useAppSelector } from "../../../store";
const CommentCard: React.FC<{ comment: CommentDB; postId: string }> = (
    props
) => {
    const [formattedDate, setFormattedDate] = useState("");
    const [likes, setLikes] = useState(props.comment.likes);
    const [likeStatus, setLikeStatus] = useState(false);
    const [alert, setAlert, stop] = useAlert(2000);
    const [comment, setComment] = useState(
        new CommentDB(
            props.comment.userId,
            props.comment.commentText,
            props.comment.createdAt,
            props.comment.updatedAt,
            props.comment._id,
            props.comment.imageUrl,
            props.comment.likes
        )
    );
    const token = useAppSelector((state) => state.user.token);
    useEffect(() => {
        const prepareComment = async () => {
            if (props.comment.createdAt) {
                setFormattedDate(formatDate(props.comment.createdAt));
                const result = await comment.checkLikeStatus(token!);
                if (result.ok) {
                    setLikeStatus(true);
                }
            }
        };
        prepareComment();
    }, []);
    const onLikeHandler = async () => {
        const result = await comment.like(token!, props.postId);
        if (result.ok) {
            setLikes(result.likes);
            if (result.message === "LIKED") {
                setLikeStatus(true);
            } else if (result.message === "DISLIKED") {
                setLikeStatus(false);
            }
        } else {
            setAlert(result.message);
            stop();
        }
    };

    return (
        <div data-testid="comment-card" className={styles["comment-card"]}>
            {alert && <ModalPortal colorsScheme="error">{alert}</ModalPortal>}
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
            <div>
                <Likes
                    onLikeHandler={onLikeHandler}
                    likes={likes}
                    likeStatus={likeStatus}
                />
            </div>
            <div></div>
            <div> {props.comment.commentText}</div>
            <div></div>
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
