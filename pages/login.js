import React, { useEffect, useState, useCallback } from "react";
import { useUser, useIsMounted } from "../lib/hooks";
import { Magic } from "magic-sdk";
import { useRouter } from "next/router";
import Layout from "../components/layout";
import Button from "../components/button";

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
      <div className="px-4 py-2">
        <div class="text-center text-5xl font-extrabold leading-none tracking-tight pt-8">
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
            CV Generator
          </span>
        </div>

        <Layout>
          <form className="px-2 py-4 sm:p-12" onSubmit={onSubmit}>
            <h2 className="pb-2 text-2xl font-semibold">Log in</h2>

            <label htmlFor="email" className="block">
              Email
              <span aria-hidden={true} className="text-red-600">
                *
              </span>
            </label>
            <input
              className="form-input block my-2 w-full"
              type="email"
              name="email"
              required
              placeholder="hello@magic.link"
            />

            <Button disabled={isLoggingIn} type="submit">
              Sign Up / Login
            </Button>

            {errorMsg && <p className="error text-red-400">{errorMsg}</p>}
          </form>
        </Layout>
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
    </>
  );
}
