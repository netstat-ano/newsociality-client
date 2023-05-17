import { useRouter } from "next/router";
import { useState } from "react";
import PostCard from "../../Posts/PostCard/PostCard";
import { useEffect } from "react";
import TrendingSwitch from "../../TrendingSwitch/TrendingSwitch";
import Pagination from "../../UI/Pagination/Pagination";
import { subtractHours } from "../../Posts/PopularPosts/PopularPosts";
import NewsDB from "../../../models/NewsDB";
const PopularNews: React.FC<{}> = () => {
    const router = useRouter();
    const [posts, setNews] = useState<NewsDB[]>([]);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);
    useEffect(() => {
        const fetchNews = async () => {
            let popularTime;
            if (router.query.trending) {
                popularTime = subtractHours(
                    new Date(),
                    Number(router.query.trending)
                );
            } else {
                popularTime = subtractHours(new Date(), 6);
            }
            const result = await NewsDB.getPopularNews(
                popularTime,
                String(router.query.page)
            );
            console.log(result);
            setIsLastPage(result.lastPage);
            setNews(result.news);
        };
        fetchNews();
    }, [router.query.trending]);
    return (
        <>
            <TrendingSwitch />

            {/* {posts.map((post) => (
                <PostCard key={post._id} post={post} />
            ))}
            {posts.length === 40 && !isLastPage && (
                <Pagination lastPage={isLastPage} />
            )} */}
        </>
    );
};
export default PopularNews;
