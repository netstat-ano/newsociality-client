import { NextPage } from "next";
import PostCreator from "../../components/Posts/PostCreator/PostCreator";
import Wrapper from "../../components/UI/Wrapper/Wrapper";
import { useAppSelector } from "../../store";
const PostsPage: NextPage = () => {
    const userId = useAppSelector((state) => state.user.userId);
    return (
        <Wrapper>
            <>{userId && <PostCreator />}</>
        </Wrapper>
    );
};
export default PostsPage;
