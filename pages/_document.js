import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta name="theme-color" content="#4566EC" />
                <meta name="description" content="Manage what you have to do - a simple weekly to-do list app." />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
