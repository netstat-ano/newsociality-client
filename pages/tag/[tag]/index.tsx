import { NextPage } from "next";
import Pagination from "../../../components/UI/Pagination/Pagination";
import PostDB from "../../../models/PostDB";
import { PostData } from "../../../models/PostDB";
import PostCard from "../../../components/Posts/PostCard/PostCard";
import { NextApiRequest, NextApiResponse } from "next";
import PostCreator from "../../../components/Posts/PostCreator/PostCreator";
const TagPosts: NextPage<{ fetchedData: PostData }> = (props) => {
    return (
        <>
            <PostCreator />
            {!props.fetchedData && <h1>Nie znaleziono wpisów</h1>}
            {props.fetchedData &&
                props.fetchedData.posts &&
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
        const fetchedData = await PostDB.getPostsByTag(
            String(req.query.tag),
            String(req.query.page)
        );
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
