import { useRouter } from "next/router";
import { useState } from "react";
import NewsCard from "../NewsCard/NewsCard";
import { useEffect } from "react";
import TrendingSwitch from "../../TrendingSwitch/TrendingSwitch";
import Pagination from "../../UI/Pagination/Pagination";
import { subtractHours } from "../../Posts/PopularPosts/PopularPosts";
import PostDB from "../../../models/PostDB";
const PopularNews: React.FC<{}> = () => {
    const router = useRouter();
    const [news, setNews] = useState<PostDB[]>([]);
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
            const result = await PostDB.getPopularPosts(
                popularTime,
                "news",
                String(router.query.page)
            );

            setIsLastPage(result.lastPage);
            setNews(result.posts);
        };
        fetchNews();
    }, [router.query.trending]);
    return (
        <>
            <TrendingSwitch />

            {news.map((singleNews) => (
                <NewsCard key={singleNews._id} news={singleNews} />
            ))}
            {news.length === 40 && !isLastPage && (
                <Pagination lastPage={isLastPage} />
            )}
        </>
    );
};
export default PopularNews;
