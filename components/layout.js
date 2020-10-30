import Head from "next/head";
import { useUser } from "../lib/hooks";

export default function Layout({ children }) {
  const { user } = useUser();

  return (
    <>
      <Head>
        <title>Magic</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="grid grid-cols-2 border-b py-4 px-2">
        <span className="text-lg font-semibold">CV Generator</span>
        {user && (
          <div className="flex gap-4 pr-2 justify-self-end">
            <span className="text-gray-700">{user.email}</span>
            <a className="text-center underline" href="/api/logout">
              Logout
            </a>
          </div>
        )}
      </div>

      <main className="pt-8">
        <div className="max-w-screen-sm my-0 mx-auto shadow overflow-hidden">
          {children}
        </div>
      </main>
    </>
  );
}
