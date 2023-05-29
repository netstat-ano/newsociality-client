import { useEffect, useState } from "react";
import PostDB from "../../../models/PostDB";
import PostCard from "../PostCard/PostCard";
import { useRouter } from "next/router";
import Pagination from "../../UI/Pagination/Pagination";
import TrendingSwitch from "../../TrendingSwitch/TrendingSwitch";

export const subtractHours = (date: Date, hours: number) => {
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
                "post",
                String(router.query.page)
            );

            setIsLastPage(result.lastPage);
            setPosts(result.posts);
        };
        fetchPosts();
    }, [router.query.trending]);
    return (
        <>
            <TrendingSwitch />

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
