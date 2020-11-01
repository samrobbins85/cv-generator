import { useRouter } from "next/router";
import Head from "next/head";
import Error from "next/error";
import { q, adminClient } from "@/lib/faunadb";

export default function User(user_data) {
  const router = useRouter();
  const { email } = router.query;

  if (
    (Object.keys(user_data).length === 0 && user_data.constructor === Object) ||
    user_data.user_data === null
  ) {
    return <Error statusCode={404} />;
  }

  var profile = user_data.user_data;

  return (
    <>
      <Head>
        <title>CV | {profile.name}</title>
      </Head>
      <div className="container mx-auto pt-8 px-4">
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
        {profile.skills && (
          <>
            <h2 className="text-xl font-semibold">Skills</h2>
            <ul className="list-disc pl-8">
              {profile.skills.map((x) => (
                <li>{x}</li>
              ))}
            </ul>
          </>
        )}
        {profile.experience && (
          <>
            <h2 className="text-xl font-semibold">Experience</h2>
            {profile.experience.map((x) => (
              <div className="grid grid-cols-2 py-1">
                <h3 className="font-semibold">{x.position}</h3>
                <p className="italic justify-self-end ">{x.duration}</p>
                <p className="col-span-2">{x.description}</p>
              </div>
            ))}
          </>
        )}
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
    },
    revalidate: 1,
  };
}
export async function getStaticPaths() {
  return {
    paths: [{ params: { email: "samrobbinsgb@gmail.com" } }],
    fallback: true,
  };
}
