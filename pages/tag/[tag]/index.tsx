import { NextPage } from "next";
import Pagination from "../../../components/UI/Pagination/Pagination";
import PostDB from "../../../models/PostDB";
import { PostData } from "../../../models/PostDB";
import PostCard from "../../../components/Posts/PostCard/PostCard";
import { NextApiRequest, NextApiResponse } from "next";
import PostCreator from "../../../components/Posts/PostCreator/PostCreator";
import { useAppSelector } from "../../../store";
import { useRouter } from "next/router";
import ContentTypeOptions from "../../../components/ContentTypeOptions/ContentTypeOptions";
import NewsCard from "../../../components/News/NewsCard/NewsCard";
const TagPosts: NextPage<{ fetchedData: PostData }> = (props) => {
    const token = useAppSelector((state) => state.user.token);
    const router = useRouter();
    return (
        <>
            {token && <PostCreator />}
            <ContentTypeOptions />
            {!props.fetchedData && <h1>Nie znaleziono wpisów</h1>}
            {router.query.type === "news" &&
                props.fetchedData.posts.map((post) => (
                    <NewsCard key={post._id} news={post} />
                ))}
            {router.query.type !== "news" &&
                props.fetchedData.posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                ))}
            {props.fetchedData.posts.length === 40 &&
                !props.fetchedData.lastPage && (
                    <Pagination lastPage={props.fetchedData.lastPage} />
                )}
        </>
    );
};
export default TagPosts;

export const getServerSideProps = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    if (req.query.tag) {
        if (req.query.type === "news") {
            var fetchedData = await PostDB.getPostsByTag(
                String(req.query.tag),
                String(req.query.page),
                "news"
            );
        } else {
            var fetchedData = await PostDB.getPostsByTag(
                String(req.query.tag),
                String(req.query.page)
            );
        }
        if (!fetchedData.ok) {
            return {
                notFound: true,
            };
        }

        return {
            props: {
                fetchedData,
            },
        };
    }
    return {
        notFound: true,
    };
};
