import Head from "next/head";
import { useUser } from "../lib/hooks";

export default function Layout({ children }) {
  const { user } = useUser();

  return (
    <>
      <Head>
        <title>CV Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="pt-8">
        <div className="max-w-screen-sm my-0 mx-auto shadow overflow-hidden">
          {children}
        </div>
      </main>
    </>
  );
}
