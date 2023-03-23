import { PostData } from "../../../models/Post";
import Card from "../../UI/Card/Card";
import Avatar from "../../User/Avatar/Avatar";
import { useEffect, useState } from "react";
import styles from "./PostCard.module.scss";
import Link from "next/link";
import PostImage from "../PostImage/PostImage";
import CommentsSection from "../CommentsSection/CommentsSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faPlus } from "@fortawesome/free-solid-svg-icons";
import formatDate from "../../../utils/FormatDate";
const PostCard: React.FC<{ post: PostData }> = (props) => {
    const [formattedDate, setFormattedDate] = useState("");
    const [isCommentsShowed, setIsCommentsShowed] = useState(false);
    const onToggleCommentsHandler = () => {
        setIsCommentsShowed((prevState) => !prevState);
    };
    useEffect(() => {
        if (props.post.createdAt) {
            const date = formatDate(props.post.createdAt);
            setFormattedDate(date);
        }
    }, []);
    return (
        <Card className={styles["post-card"]}>
            <>
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
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faPlus} />
                            {props.post.likes ? props.post.likes : 0}
                        </div>
                        <div className={styles["post-card__user-data__date"]}>
                            {formattedDate}
                        </div>
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
                        <FontAwesomeIcon
                            onClick={onToggleCommentsHandler}
                            icon={faComment}
                        />
                    </div>
                </div>
                {isCommentsShowed && (
                    <CommentsSection postId={props.post._id} />
                )}
            </>
        </Card>
    );
};
export default PostCard;
