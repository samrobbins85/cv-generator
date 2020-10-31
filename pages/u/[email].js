import { useRouter } from "next/router";
import useSWR from "swr";
import Error from "next/error";
import { q, adminClient } from "@/lib/faunadb";
import user from "pages/api/user";

export default function User(user_data) {
  console.log(user_data);
  const router = useRouter();
  const { email } = router.query;

  // const jsonFetcher = (selector) => (url) =>
  //   fetch(url)
  //     .then((r) => r.json())
  //     .then((data) => (selector ? get(data, selector, null) : data ?? null));

  // const fetcher = async (url) => {
  //   const res = await fetch(url);
  //   // If the status code is not in the range 200-299,
  //   // we still try to parse and throw it.
  //   if (!res.ok) {
  //     const error = new Error("An error occurred while fetching the data.");
  //     // Attach extra info to the error object.
  //     error.info = await res.json();
  //     error.status = res.status;
  //     throw error;
  //   }
  //   return res.json();
  // };

  // function useUser() {
  //   const { data, error } = useSWR(`/api/user_details?email=${email}`, fetcher);
  //   const user = data?.user ?? null;
  //   return { user, error };
  // }
  // const { user, error } = useUser();

  // if (error) return <Error statusCode={error.status} />;
  // if (!user) return <div>loading...</div>;
  // var profile = user.data;

  if (
    (Object.keys(user_data).length === 0 && user_data.constructor === Object) ||
    user_data.user_data === null
  ) {
    return <Error statusCode={404} />;
  }

  var profile = user_data.user_data;

  return (
    <>
      <div className="container mx-auto pt-8">
        <h1 className="text-center text-4xl font-semibold">{profile.name}</h1>
        <span className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="inline-block mr-2"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <a className="underline text-blue-700" href={"mailto:" + email}>
            {email}
          </a>
        </span>
        <h2 className="text-xl font-semibold">Skills</h2>
        <ul className="list-disc pl-8">
          {profile.skills.map((x) => (
            <li>{x}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export async function getStaticProps(context) {
  const email = context.params.email;
  var user_data = await adminClient
    .query(q.Get(q.Match(q.Index("users_by_email"), email)))
    .catch(() => null);
  if (user_data) {
    user_data = user_data.data;
  }

  return {
    props: {
      user_data,
    }, // will be passed to the page component as props
    revalidate: 1,
  };
}
export async function getStaticPaths() {
  return {
    paths: [{ params: { email: "samrobbinsgb@gmail.com" } }],
    fallback: true,
  };
}
