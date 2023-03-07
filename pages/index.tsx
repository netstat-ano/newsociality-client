import type { NextPage } from "next";
import Head from "next/head";
import Wrapper from "../components/UI/Wrapper/Wrapper";
const Home: NextPage = (props) => {
    return (
        <Wrapper>
            <>
                <Head>
                    <title>Newsociality</title>
                </Head>
                <h1>Homepage</h1>
            </>
        </Wrapper>
    );
};

export default Home;
