import { NextPage } from "next";
import NewsCreator from "../../components/News/NewsCreator/NewsCreator";
import PopularNews from "../../components/News/PopularNews/PopularNews";
const NewsPage: NextPage = () => {
    return (
        <>
            <NewsCreator />
            <PopularNews />
        </>
    );
};
export default NewsPage;
