import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Post from "../../../models/Post";
import { PostResponse } from "../../../models/Post";
import PostCard from "../../../components/Posts/PostCard/PostCard";
import { NextApiRequest, NextApiResponse } from "next";
const TagPosts: NextPage<{ fetchedData: PostResponse }> = (props) => {
    return (
        <>
            {!props.fetchedData && <h1>Nie znaleziono wpisów</h1>}
            {props.fetchedData &&
                props.fetchedData.posts &&
                props.fetchedData.posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                ))}
        </>
    );
};
export default TagPosts;

export const getServerSideProps = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    if (req.query.tag) {
        const fetchedData = await Post.getPostsByTag(String(req.query.tag));
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
