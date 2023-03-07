import { NextPage } from "next";
import Wrapper from "../components/UI/Wrapper/Wrapper";
import Head from "next/head";
const NotFoundPage: NextPage = () => {
    return (
        <Wrapper>
            <>
                <Head>
                    <title>Error 404</title>
                </Head>
                <div style={{ textAlign: "center" }}>
                    <h1>404</h1>
                    <h2>Nie znaleziono żądanej strony</h2>
                </div>
            </>
        </Wrapper>
    );
};
export default NotFoundPage;
