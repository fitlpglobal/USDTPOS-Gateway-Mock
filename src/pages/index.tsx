import Head from "next/head";
import { ApiDoc } from "~/modules/apidoc";

export default function Home() {
  return (
    <>
      <Head>
        <title>USDT API Mock</title>
        <meta name="description" content="USDT API Mock Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen">
        <ApiDoc />
      </main>
    </>
  );
}
