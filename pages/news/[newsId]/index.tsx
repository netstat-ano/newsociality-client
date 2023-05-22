import { NextPage, NextApiRequest, NextApiResponse } from "next";
import PostDB from "../../../models/PostDB";
import NewsCard from "../../../components/News/NewsCard/NewsCard";
const NewsDetails: NextPage<{ post: PostDB }> = (props) => {
    return (
        <>
            <NewsCard commentsDefaultShowed={true} news={props.post} />
        </>
    );
};
export default NewsDetails;
export const getServerSideProps = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    const result = await PostDB.getPostById(String(req.query.newsId), "news");
    if (result.ok) {
        return {
            props: { post: result.post },
        };
    } else {
        return {
            notFound: true,
        };
    }
};
