import React, { useEffect, useState, useCallback } from "react";
import { useUser, useIsMounted } from "../lib/hooks";
import { Magic } from "magic-sdk";
import { useRouter } from "next/router";
import Layout from "../components/layout";

export default function Login() {
  const router = useRouter();
  const { user } = useUser();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState(undefined);
  const isMounted = useIsMounted();

  useEffect(() => {
    // If a user is already logged in,
    // redirect to the home page automatically.
    if (user) router.push("/");
  }, [user]);

  const login = useCallback(
    async (email) => {
      if (isMounted() && errorMsg) setErrorMsg(undefined);

      try {
        /* Step 4.1: Generate a DID token with Magic */
        const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);
        const didToken = await magic.auth.loginWithMagicLink({ email });

        /* Step 4.4: POST to our /login endpoint */

        const res = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${didToken}`,
          },
          body: JSON.stringify({ email }),
        });

        if (res.status === 200) {
          // If we reach this line, it means our
          // authentication succeeded, so we'll
          // redirect to the home page!
          router.push("/");
        } else {
          throw new Error(await res.text());
        }
      } catch (err) {
        console.error("An unexpected error occurred:", err);
        if (isMounted()) setErrorMsg(err.message);
      }
    },
    [errorMsg]
  );

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (isLoggingIn) return;
      setIsLoggingIn(true);
      login(e.currentTarget.email.value).then(() => setIsLoggingIn(false));
    },
    [login, isLoggingIn]
  );

  return (
    <>
      <div className="flex py-2 flex-col px-4">
        <div class="text-center text-5xl font-extrabold leading-none tracking-tight pt-8">
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
            CV Generator
          </span>
        </div>

        <div className="py-10">
          <p className="text-center pt-10 container mx-auto">
            Note that the idea of this website is to publicly share your CV, so
            all data you enter will be public
          </p>
          <p className="text-center pt-8">
            This project is open source, and the repository can be found{" "}
            <a
              className="text-blue-700 hover:underline"
              href="https://github.com/samrobbins85/cv-generator"
            >
              here
            </a>
          </p>
        </div>

        <div className="py-10 flex-grow">
          <div>
            <h2 className="text-center text-3xl font-bold">
              Sign up or Log In
            </h2>
          </div>
          <Layout>
            <form className="px-2 py-4 sm:p-12" onSubmit={onSubmit}>
              <input
                aria-label="Email address"
                className="form-input block my-2 w-full"
                type="email"
                name="email"
                required
                placeholder="Email address"
              />
              <div className="flex justify-center">
                <button
                  className="w-full rounded py-2 mt-4 bg-blue-600 text-white font-semibold hover:bg-blue-500"
                  type="submit"
                >
                  Sign Up / Login
                </button>
              </div>

              {errorMsg && <p className="error text-red-400">{errorMsg}</p>}
            </form>
          </Layout>
        </div>
      </div>
    </>
  );
}
