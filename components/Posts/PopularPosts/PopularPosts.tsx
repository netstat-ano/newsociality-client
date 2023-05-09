import { useEffect, useState } from "react";
import PostDB from "../../../models/PostDB";
import styles from "./PopularPosts.module.scss";
import PostCard from "../PostCard/PostCard";
import { useRouter } from "next/router";
import Link from "next/link";
import Wrapper from "../../UI/Wrapper/Wrapper";

const subtractHours = (date: Date, hours: number) => {
    date.setHours(date.getHours() - hours);
    return date;
};

const PopularPosts: React.FC<{}> = () => {
    const router = useRouter();
    const [posts, setPosts] = useState<PostDB[]>([]);

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
            console.log(router.query);
            const result = await PostDB.getPopularPosts(popularTime);
            setPosts(result.posts);
        };
        fetchPosts();
    }, [router.query.trending]);
    return (
        <>
            <div className={styles["popular-posts__links"]}>
                <Link
                    className={
                        router.query.trending === "6"
                            ? styles["popular-posts__links-active"]
                            : ""
                    }
                    href={"/posts?trending=6"}
                >
                    Gorące 6h
                </Link>{" "}
                <Link
                    className={
                        router.query.trending === "12"
                            ? styles["popular-posts__links-active"]
                            : ""
                    }
                    href={"/posts?trending=12"}
                >
                    Gorące 12h
                </Link>{" "}
                <Link
                    className={
                        router.query.trending === "24"
                            ? styles["popular-posts__links-active"]
                            : ""
                    }
                    href={"/posts?trending=24"}
                >
                    Gorące 24h
                </Link>{" "}
            </div>

            {posts.map((post) => (
                <PostCard post={post} />
            ))}
        </>
    );
};
export default PopularPosts;
