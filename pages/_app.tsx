import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { Provider } from "react-redux";
import store from "../store";
function MyApp({ Component, pageProps }: AppProps) {
    axios.defaults.headers.post["Content-Type"] = "application/json";
    axios.defaults.baseURL = process.env.API_URL;
    return (
        <Provider store={store}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </Provider>
    );
}

export default MyApp;
