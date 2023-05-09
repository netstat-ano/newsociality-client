import { NextPage } from "next";
import PostCreator from "../../components/Posts/PostCreator/PostCreator";
import Wrapper from "../../components/UI/Wrapper/Wrapper";
import { useAppSelector } from "../../store";
import PopularPosts from "../../components/Posts/PopularPosts/PopularPosts";
const PostsPage: NextPage = () => {
    const userId = useAppSelector((state) => state.user.userId);
    return (
        <>
            {userId && <PostCreator />}

            <PopularPosts />
        </>
    );
};
export default PostsPage;
