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

const ProfileDetails: NextPage<{ user: UserDB }> = (props) => {
    const router = useRouter();
    const [posts, setPosts] = useState<PostDB[]>([]);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);
    useEffect(() => {
        const fetchContent = async () => {
            if (router.query.tab === "posts") {
                const result = await PostDB.getPostsByUserId(
                    props.user._id,
                    String(router.query.page)
                );
                setPosts(result.posts);
                setIsLastPage(result.lastPage);
            } else if (router.query.tab === "liked-posts") {
                const result = await PostDB.getPostsLikedByUserId(
                    props.user._id,
                    String(router.query.page)
                );
                setPosts(result.posts);
                setIsLastPage(result.lastPage);
            } else {
                setPosts([]);
            }
        };
        fetchContent();
    }, [router.query.tab, router.query.page]);
    return (
        <div className={styles["profile-details"]}>
            <div className={styles["profile-details__userinfo"]}>
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
            <div className={styles["profile-details__content"]}>
                {posts.map((post) => (
                    <PostCard post={post} />
                ))}
                {posts.length > 0 && <Pagination lastPage={isLastPage} />}
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
