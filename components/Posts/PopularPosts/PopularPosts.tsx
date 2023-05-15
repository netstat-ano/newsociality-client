import { useEffect, useState } from "react";
import PostDB from "../../../models/PostDB";
import styles from "./PopularPosts.module.scss";
import PostCard from "../PostCard/PostCard";
import { useRouter } from "next/router";
import Link from "next/link";
import Pagination from "../../UI/Pagination/Pagination";

const subtractHours = (date: Date, hours: number) => {
    date.setHours(date.getHours() - hours);
    return date;
};

const PopularPosts: React.FC<{}> = () => {
    const router = useRouter();
    const [posts, setPosts] = useState<PostDB[]>([]);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);
    useEffect(() => {
        const fetchPosts = async () => {
            let popularTime;
            if (router.query.trending) {
                popularTime = subtractHours(
                    new Date(),
                    Number(router.query.trending)
                );
            } else {
                popularTime = subtractHours(new Date(), 6);
            }
            const result = await PostDB.getPopularPosts(
                popularTime,
                String(router.query.page)
            );
            setIsLastPage(result.lastPage);
            setPosts(result.posts);
        };
        fetchPosts();
    }, [router.query.trending]);
    return (
        <>
            <div className={styles["popular-posts__links"]}>
                {router.pathname === "/posts" && (
                    <Link
                        className={
                            router.query.trending === "6"
                                ? styles["popular-posts__links-active"]
                                : ""
                        }
                        href={"/posts?trending=6&page=0"}
                    >
                        Gorące 6h
                    </Link>
                )}{" "}
                {router.pathname === "/posts" && (
                    <Link
                        className={
                            router.query.trending === "12"
                                ? styles["popular-posts__links-active"]
                                : ""
                        }
                        href={"/posts?trending=12&page=0"}
                    >
                        Gorące 12h
                    </Link>
                )}{" "}
                {router.pathname === "/posts" && (
                    <Link
                        className={
                            router.query.trending === "24"
                                ? styles["popular-posts__links-active"]
                                : ""
                        }
                        href={"/posts?trending=24&page=0"}
                    >
                        Gorące 24h
                    </Link>
                )}
            </div>

            {posts.map((post) => (
                <PostCard key={post._id} post={post} />
            ))}
            {posts.length === 40 && !isLastPage && (
                <Pagination lastPage={isLastPage} />
            )}
        </>
    );
};
export default PopularPosts;
