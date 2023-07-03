import Card from "../../UI/Card/Card";
import Avatar from "../../User/Avatar/Avatar";
import { useEffect, useState } from "react";
import styles from "./NewsCard.module.scss";
import Link from "next/link";
import CommentsSection from "../../Posts/CommentsSection/CommentsSection";
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
import AnimatedContextMenu from "../../UI/AnimatedContextMenu/AnimatedContextMenu";
const NewsCard: React.FC<{ news: PostDB; commentsDefaultShowed?: boolean }> = (
    props
) => {
    const [formattedDate, setFormattedDate] = useState("");
    const [isCommentsShowed, setIsCommentsShowed] = useState(
        props.commentsDefaultShowed ? true : false
    );
    const [likes, setLikes] = useState(props.news.likes);
    const [alert, setAlert, stop] = useAlert(2000);
    const userId = useAppSelector((state) => state.user.userId);
    const [likeStatus, setLikeStatus] = useState(false);
    const text = props.news.newsDescription!.split("\r");
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

    const [news, setNews] = useState<PostDB | undefined>(
        new PostDB(
            props.news.userId,
            props.news._id,
            props.news.createdAt,
            props.news.updatedAt,
            props.news.tags,
            undefined,
            undefined,
            props.news.likes,
            props.news.comments,
            props.news.newsDescription,
            props.news.newsUrl,
            props.news.newsTitle
        )
    );
    const token = useAppSelector((state) => state.user.token);
    const onToggleCommentsHandler = () => {
        setIsCommentsShowed((prevState) => !prevState);
    };
    const onDeletePostHandler = async () => {
        if (news) {
            const result = await news.delete(token!);
            if (result.ok) {
                console.log("post deleted");
                setNews(undefined);
            }
        }
    };
    useEffect(() => {
        const preparePost = async () => {
            if (news && props.news.createdAt) {
                const date = formatDate(props.news.createdAt);
                if (token) {
                    const result = await news.checkLikeStatus(token!);
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
        if (news) {
            const result = await news.like(token!);
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
        }
    };
    if (!news) {
        return <></>;
    }
    return (
        <Card className={styles["post-card"]}>
            <>
                {alert && (
                    <ModalPortal colorsScheme="error">{alert}</ModalPortal>
                )}
                <div className={styles["post-card__user"]}>
                    <div
                        className={`center ${styles["post-card__user__avatar"]} `}
                    >
                        <Avatar
                            src={`${process.env.API_URL}/${props.news.userId.avatarUrl}`}
                        />
                    </div>
                    <div className={styles["post-card__user-data"]}>
                        <div>
                            <Link href={`/profile/${props.news.userId._id}`}>
                                {props.news.userId.username ||
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
                        {news && (
                            <Link href={`/news/${news._id}`}>
                                <FontAwesomeIcon icon={faUpRightFromSquare} />
                            </Link>
                        )}
                    </div>
                </div>
                <div className={styles["post-card__text"]}>
                    <div>
                        <h3>{props.news.newsTitle}</h3>
                    </div>
                    <div className={styles["post-card__url"]}>
                        <a target="_blank" href={props.news.newsUrl!}>
                            {props.news.newsUrl}
                        </a>
                    </div>
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
                    <div className="center"></div>
                    <div
                        className={styles["news-card__actions"]}
                        data-testid="comments-wrapper"
                    >
                        <div>
                            {!props.commentsDefaultShowed && (
                                <FontAwesomeIcon
                                    onClick={onToggleCommentsHandler}
                                    icon={faComment}
                                />
                            )}
                        </div>
                        <AnimatedContextMenu>
                            <>
                                {news && userId === news.userId._id && (
                                    <li onClick={onDeletePostHandler}>
                                        Usuń wiadomość
                                    </li>
                                )}
                            </>
                        </AnimatedContextMenu>
                    </div>
                </div>
                {(isCommentsShowed || props.commentsDefaultShowed) && (
                    <CommentsSection postId={props.news._id} />
                )}
            </>
        </Card>
    );
};
export default NewsCard;
