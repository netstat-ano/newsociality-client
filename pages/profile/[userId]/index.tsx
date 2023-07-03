import Link from "next/link";
import UserDB from "../../../models/UserDB";
import { NextApiRequest, NextApiResponse, NextPage } from "next";
import styles from "./ProfileDetails.module.scss";
import PostImage from "../../../components/Posts/PostImage/PostImage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PostDB from "../../../models/PostDB";
import PostCard from "../../../components/Posts/PostCard/PostCard";
import Pagination from "../../../components/UI/Pagination/Pagination";
import NewsCard from "../../../components/News/NewsCard/NewsCard";
import TabElement from "../../../components/UI/TabElement/TabElement";
import Tabs from "../../../components/UI/Tabs/Tabs";
import { useAppSelector } from "../../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const ProfileDetails: NextPage<{ user: UserDB }> = (props) => {
    const router = useRouter();
    const [posts, setPosts] = useState<PostDB[] | undefined>(undefined);
    const [isLastPage, setIsLastPage] = useState<boolean>(true);
    const [followedTags, setFollowedTags] = useState<string[]>([]);
    const userId = useAppSelector((state) => state.user.userId);
    const token = useAppSelector((state) => state.user.token);
    const username = useAppSelector((state) => state.user.username);
    const avatarUrl = useAppSelector((state) => state.user.avatarUrl);
    const itIsMyProfile = userId === router.query.userId;
    const onDeleteFollowedTag = async (tag: string) => {
        if (userId && username && avatarUrl && token) {
            const result = await PostDB.followTag(tag, token);
            if (result.ok) {
                setFollowedTags((prevState) =>
                    prevState.filter((value) => value !== tag)
                );
            }
        }
    };
    useEffect(() => {
        const fetchContent = async () => {
            if (router.query.tab === "posts") {
                const result = await PostDB.getPostsByUserId(
                    props.user._id,
                    String(router.query.page),
                    "posts"
                );
                setPosts(result.posts);
                setIsLastPage(result.lastPage);
            } else if (
                router.query.tab === "liked-posts" ||
                router.query.tab === "liked-news"
            ) {
                const result = await PostDB.getPostsLikedByUserId(
                    props.user._id,
                    String(router.query.page),
                    "posts"
                );
                console.log(result.posts);
                setPosts(result.posts);
                setIsLastPage(result.lastPage);
            } else if (router.query.tab === "news") {
                const result = await PostDB.getPostsByUserId(
                    props.user._id,
                    String(router.query.page),
                    "news"
                );
                setPosts(result.posts);
                setIsLastPage(result.lastPage);
            } else if (router.query.tab === "followed-tags") {
                if (token && userId) {
                    const result = await UserDB.getFollowedTagsById(
                        token,
                        userId
                    );
                    if (result.ok) {
                        setFollowedTags(result.tags);
                    }
                }
            } else {
                setPosts(undefined);
            }
        };
        fetchContent();
    }, [router.query.tab, router.query.page]);
    return (
        <div
            className={`${styles["profile-details"]} ${
                itIsMyProfile ? styles["gd-5"] : styles["gd-4"]
            }`}
        >
            <div
                className={`${styles["profile-details__userinfo"]} ${
                    itIsMyProfile ? styles["merge-5"] : styles["merge-4"]
                }`}
            >
                <div className={styles["profile-details-userinfo__avatar"]}>
                    <PostImage src={`/${props.user.avatarUrl}`} />
                </div>
                <div>
                    <h3>{props.user.username}</h3>
                </div>
            </div>
            <div className={styles["profile-details__tab"]}>
                <Link
                    className={
                        router.query.tab === "posts" ? styles["active"] : ""
                    }
                    href={`/profile/${props.user._id}?tab=posts&page=0`}
                >
                    Moje wpisy
                </Link>
            </div>
            <div className={styles["profile-details__tab"]}>
                <Link
                    className={
                        router.query.tab === "liked-posts"
                            ? styles["active"]
                            : ""
                    }
                    href={`/profile/${props.user._id}?tab=liked-posts&page=0`}
                >
                    Plusowane wpisy
                </Link>
            </div>
            <div className={styles["profile-details__tab"]}>
                <Link
                    className={
                        router.query.tab === "news" ? styles["active"] : ""
                    }
                    href={`/profile/${props.user._id}?tab=news&page=0`}
                >
                    Moje wiadomości
                </Link>
            </div>
            <div className={styles["profile-details__tab"]}>
                <Link
                    className={
                        router.query.tab === "liked-news"
                            ? styles["active"]
                            : ""
                    }
                    href={`/profile/${props.user._id}?tab=liked-news&page=0`}
                >
                    Plusowane wiadomości
                </Link>
            </div>
            {userId === router.query.userId && (
                <div className={styles["profile-details__tab"]}>
                    <Link
                        className={
                            router.query.tab === "followed-tags"
                                ? styles["active"]
                                : ""
                        }
                        href={`/profile/${props.user._id}?tab=followed-tags&page=0`}
                    >
                        Obserwowane tagi
                    </Link>
                </div>
            )}
            <div
                className={`${styles["profile-details__content"]} ${
                    itIsMyProfile ? styles["merge-5"] : styles["merge-4"]
                }`}
            >
                {(router.query.tab === "liked-posts" ||
                    router.query.tab === "posts") &&
                    posts &&
                    posts.map((post) => {
                        if (!post.isNews) {
                            return <PostCard key={post._id} post={post} />;
                        }
                    })}
                {(router.query.tab === "liked-news" ||
                    router.query.tab === "news") &&
                    posts &&
                    posts.map((post) => {
                        if (post.isNews) {
                            return <NewsCard key={post._id} news={post} />;
                        }
                    })}
                {router.query.tab === "followed-tags" && (
                    <Tabs>
                        {followedTags.map((tag) => (
                            <TabElement>
                                <>
                                    #{tag}{" "}
                                    <FontAwesomeIcon
                                        onClick={() => {
                                            onDeleteFollowedTag(tag);
                                        }}
                                        className={
                                            styles["followed-tag-delete"]
                                        }
                                        icon={faXmark}
                                    />
                                </>
                            </TabElement>
                        ))}
                    </Tabs>
                )}
                {posts && <Pagination lastPage={isLastPage} />}
            </div>
        </div>
    );
};
export default ProfileDetails;

export const getServerSideProps = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    if (req.query.userId) {
        const result = await UserDB.getUserById(String(req.query.userId));
        if (result) {
            return {
                props: {
                    user: result.user,
                },
            };
        }
    }
    return {
        notFound: true,
    };
};
