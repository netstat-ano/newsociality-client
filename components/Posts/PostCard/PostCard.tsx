import Card from "../../UI/Card/Card";
import Avatar from "../../User/Avatar/Avatar";
import { useEffect, useState } from "react";
import styles from "./PostCard.module.scss";
import Link from "next/link";
import Post from "../../../models/Post";
import PostImage from "../PostImage/PostImage";
import CommentsSection from "../CommentsSection/CommentsSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faComment,
    faUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import formatDate from "../../../utils/formatDate";
import { useAppSelector } from "../../../store";
import useAlert from "../../../hooks/use-alert";
import ModalPortal from "../../Modal/Modal";
import PostDB from "../../../models/PostDB";
import Likes from "../../UI/Likes/Likes";
import { useRouter } from "next/router";
const PostCard: React.FC<{ post: PostDB; commentsDefaultShowed?: boolean }> = (
    props
) => {
    const [formattedDate, setFormattedDate] = useState("");
    const [isCommentsShowed, setIsCommentsShowed] = useState(
        props.commentsDefaultShowed ? true : false
    );
    const [likes, setLikes] = useState(props.post.likes);
    const [alert, setAlert, stop] = useAlert(2000);
    const [likeStatus, setLikeStatus] = useState(false);
    const router = useRouter();
    const [post, setPost] = useState<PostDB>(
        new PostDB(
            props.post.userId,
            props.post._id,
            props.post.createdAt,
            props.post.updatedAt,
            props.post.postText,
            props.post.tags,
            props.post.imgUrl,
            props.post.likes,
            props.post.comments
        )
    );
    const token = useAppSelector((state) => state.user.token);

    const onToggleCommentsHandler = () => {
        setIsCommentsShowed((prevState) => !prevState);
    };
    useEffect(() => {
        const preparePost = async () => {
            if (props.post.createdAt) {
                const date = formatDate(props.post.createdAt);

                const result = await post.checkLikeStatus(token!);
                if (result.ok) {
                    setLikeStatus(true);
                }
                setFormattedDate(date);
            }
        };
        preparePost();
    }, []);
    const onLikeHandler = async () => {
        const result = await post.like(token!);
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
        <Card className={styles["post-card"]}>
            <>
                {alert && (
                    <ModalPortal colorsScheme="error">{alert}</ModalPortal>
                )}
                <div className={styles["post-card__user"]}>
                    <div className="center">
                        <Avatar
                            src={`${process.env.API_URL}/${props.post.userId.avatarUrl}`}
                        />
                    </div>
                    <div className={styles["post-card__user-data"]}>
                        <div>
                            {props.post.userId.username ||
                                "Użytkownik usunięty"}{" "}
                            <div
                                className={styles["post-card__user-data__date"]}
                            >
                                {formattedDate}
                            </div>
                        </div>
                        <Likes
                            onLikeHandler={onLikeHandler}
                            likes={likes}
                            likeStatus={likeStatus}
                        />
                        <Link href={`/post/${post._id}`}>
                            <FontAwesomeIcon icon={faUpRightFromSquare} />
                        </Link>
                    </div>
                </div>
                <div className={styles["post-card__text"]}>
                    {props.post.postText.split(" ").map((word) => {
                        const regexp =
                            /(\s#[A-z0-9]\w+\s)|(\s#[A-z0-9]\w+)|(#[A-z0-9]\w+\s)|(#[A-z0-9]\w+)/g;
                        if (word.includes("#")) {
                            const tags = [
                                ...Array.from(
                                    word.matchAll(regexp),
                                    (tag) => tag[0]
                                ),
                            ];
                            const jsxElements = [];
                            for (let tag of tags) {
                                const formattedTag = tag.replace("#", "");
                                jsxElements.push(
                                    <Link href={`/tag/${formattedTag}`}>
                                        {tag}{" "}
                                    </Link>
                                );
                            }

                            return jsxElements.map((tag) => tag);
                        } else {
                            return `${word} `;
                        }
                    })}
                    <div className="center">
                        {props.post.imgUrl && (
                            <PostImage src={props.post.imgUrl} />
                        )}
                    </div>
                    <div>
                        {!props.commentsDefaultShowed && (
                            <FontAwesomeIcon
                                onClick={onToggleCommentsHandler}
                                icon={faComment}
                            />
                        )}
                    </div>
                </div>
                {(isCommentsShowed || props.commentsDefaultShowed) && (
                    <CommentsSection postId={props.post._id} />
                )}
            </>
        </Card>
    );
};
export default PostCard;
