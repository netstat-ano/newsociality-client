import { NextPage } from "next";
import { useRouter } from "next/router";
import PostDB from "../../models/PostDB";
import PostCard from "../../components/Posts/PostCard/PostCard";
import { useAppSelector } from "../../store";
import { useEffect, useState } from "react";
import UserDB from "../../models/UserDB";
import useAlert from "../../hooks/use-alert";
import ModalPortal from "../../components/Modal/Modal";
import ContentTypeOptions from "../../components/ContentTypeOptions/ContentTypeOptions";
import NewsCard from "../../components/News/NewsCard/NewsCard";
const fypPage: NextPage<{}> = (props) => {
    const [posts, setPosts] = useState<PostDB[]>([]);
    const user = useAppSelector((state) => state.user);
    const router = useRouter();
    const [alertText, setAlertText, stop] = useAlert(2000);
    console.log(router.query.type);
    useEffect(() => {
        const fetchPosts = async () => {
            const followedTags = await UserDB.getFollowedTagsById(
                user.token!,
                user.userId!
            );
            if (followedTags.ok) {
                const result = await PostDB.getPostsByTag(
                    followedTags.tags,
                    undefined,
                    String(router.query.type)
                );
                if (result.ok) {
                    setPosts(result.posts);
                } else {
                    setAlertText(result.message);
                    stop();
                }
            } else {
                setAlertText(followedTags.message);
                stop();
            }
        };
        fetchPosts();
    }, [router.query.type]);
    return (
        <>
            <ContentTypeOptions
                beforeAddingParams={() => {
                    setPosts([]);
                }}
            />
            {alertText && (
                <ModalPortal colorsScheme="error">{alertText}</ModalPortal>
            )}
            {router.query.type === "posts" &&
                posts.map((post) => <PostCard key={post._id} post={post} />)}
            {router.query.type !== "posts" &&
                posts.map((post) => <NewsCard key={post._id} news={post} />)}
        </>
    );
};

export default fypPage;
