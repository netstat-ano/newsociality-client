import { NextPage } from "next";
import PostDB from "../../../models/PostDB";
import { NextApiRequest, NextApiResponse } from "next";
import PostCard from "../../../components/Posts/PostCard/PostCard";
import CommentDB from "../../../models/CommentDB";
import CommentsSection from "../../../components/Posts/CommentsSection/CommentsSection";
const PostDetailPage: NextPage<{ post: PostDB; comments: CommentDB }> = (
    props
) => {
    return (
        <>
            <PostCard commentsDefaultShowed={true} post={props.post} />
        </>
    );
};

export default PostDetailPage;

export const getServerSideProps = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    const result = await PostDB.getPostById(String(req.query.postId), "post");
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
