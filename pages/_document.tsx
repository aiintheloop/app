import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" data-theme="night">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body className="loading">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
