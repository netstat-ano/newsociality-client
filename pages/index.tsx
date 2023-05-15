import type { NextPage } from "next";
import Head from "next/head";
import Wrapper from "../components/UI/Wrapper/Wrapper";
import { useAppSelector } from "../store";
import PostCreator from "../components/Posts/PostCreator/PostCreator";
import PopularPosts from "../components/Posts/PopularPosts/PopularPosts";
const Home: NextPage = (props) => {
    const token = useAppSelector((state) => state.user.token);
    return (
        <>
            <Head>
                <title>Newsociality</title>
            </Head>
            {token && <PostCreator />}

            <h3>
                Witaj w aplikacji Newsociality. Przeglądaj wpisy za pomocą
                wyszukiwarki, twórz własne posty i baw się dobrze.
            </h3>
            <PopularPosts />
        </>
    );
};

export default Home;
