import Card from "../../UI/Card/Card";
import Avatar from "../../User/Avatar/Avatar";
import { useEffect, useState } from "react";
import styles from "./PostCard.module.scss";
import Link from "next/link";
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
    const text = props.post.postText!.split("\r");
    const parsedText: string[] = [];
    const postText: string[] = [];
    for (let element of text) {
        let newElement = `${element}\r`;
        parsedText.push(newElement);
    }
    for (let element of parsedText) {
        let newElement = element.split(" ");
        postText.push(...newElement);
    }
    const [post, setPost] = useState<PostDB>(
        new PostDB(
            props.post.userId,
            props.post._id,
            props.post.createdAt,
            props.post.updatedAt,
            props.post.tags,
            props.post.postText!,
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
                if (token) {
                    const result = await post.checkLikeStatus(token!);
                    if (result.ok) {
                        setLikeStatus(true);
                    }
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
                            <Link href={`/profile/${props.post.userId._id}`}>
                                {props.post.userId.username ||
                                    "Użytkownik usunięty"}{" "}
                            </Link>
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
                    {postText.map((word) => {
                        const regexp =
                            /(\s#[A-z0-9]\w+\s)|(\s#[A-z0-9]\w+)|(#[A-z0-9]\w+\s)|(#[A-z0-9]\w+)/g;
                        if (word.trim()[0] === "#") {
                            const tag = word.match(regexp);
                            let jsxElement;
                            if (tag) {
                                const formattedTag = tag[0].replace("#", "");
                                jsxElement = (
                                    <Link href={`/tag/${formattedTag}?page=0`}>
                                        {tag}{" "}
                                    </Link>
                                );
                            }
                            return jsxElement;
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
