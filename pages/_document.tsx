import Document, {
    DocumentContext,
    DocumentInitialProps,
    Html,
    Head,
    Main,
    NextScript,
} from "next/document";
class MyDocument extends Document {
    render(): JSX.Element {
        return (
            <Html>
                <Head></Head>
                <body>
                    <div id="modal-root"></div>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
