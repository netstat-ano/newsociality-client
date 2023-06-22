import { NextPage } from "next";
import { useRouter } from "next/router";
import PostDB, { PostData } from "../../models/PostDB";
import PostCard from "../../components/Posts/PostCard/PostCard";
import { useAppSelector } from "../../store";
import { useEffect, useState } from "react";
import UserDB from "../../models/UserDB";
import useAlert from "../../hooks/use-alert";
import ModalPortal from "../../components/Modal/Modal";
import ContentTypeOptions from "../../components/ContentTypeOptions/ContentTypeOptions";
import NewsCard from "../../components/News/NewsCard/NewsCard";
import Pagination from "../../components/UI/Pagination/Pagination";
const fypPage: NextPage<{}> = (props) => {
    const [fetchedData, setFetchedData] = useState<PostData>();
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
                    String(router.query.page),
                    String(router.query.type)
                );
                if (result.ok) {
                    setFetchedData(result);
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
    }, [router.query]);
    return (
        <>
            <ContentTypeOptions
                beforeAddingParams={() => {
                    setFetchedData(undefined);
                }}
            />
            {alertText && (
                <ModalPortal colorsScheme="error">{alertText}</ModalPortal>
            )}
            {router.query.type === "posts" &&
                fetchedData &&
                fetchedData.posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                ))}
            {router.query.type !== "posts" &&
                fetchedData &&
                fetchedData.posts.map((post) => (
                    <NewsCard key={post._id} news={post} />
                ))}
            {fetchedData && <Pagination lastPage={fetchedData.lastPage} />}
        </>
    );
};

export default fypPage;
