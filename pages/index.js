import React, { useCallback, useEffect, useState } from "react";
import { useUser, useFirstRender, useAllTodos } from "../lib/hooks";
import { useRouter } from "next/router";
import Layout from "../components/layout";
import Spinner from "../components/spinner";
import AddTodo from "../components/add-todo";
import TodoItem from "../components/todo-item";
import Button from "../components/button";

export default function Home() {
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  const [name, setName] = useState("Alan Turing");
  const [inSkill, setInSkill] = useState("");
  const [allSkills, setAllSkills] = useState([]);
  const [currExp, setCurrExp] = useState({});
  const [allExp, setAllExp] = useState([]);
  const isFirstRender = useFirstRender();

  const { user, loading: userLoading } = useUser();
  const { todos, loading: todosLoading, mutate: mutateTodos } = useAllTodos();

  useEffect(() => {
    // Flag initialization complete,
    // this will hide the loading state.
    if (user && !userLoading && !todosLoading && !initialized) {
      setInitialized(true);
      if (user.user.data.name) {
        setName(user.user.data.name);
      }
      if (user.user.data.skills && allSkills.length === 0) {
        setAllSkills(user.user.data.skills);
      }
      if (user.user.data.experience && allExp.length === 0) {
        setAllExp(user.user.data.experience);
      }
    }
  }, [user, userLoading, todosLoading, initialized]);

  useEffect(() => {
    // If no user is logged in, redirect
    // to the `/login` page automatically.
    if (!(user || userLoading) && !isFirstRender) {
      router.push("/login");
    }
  }, [user, userLoading]);

  function handleExpChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    setCurrExp({
      ...currExp,
      [name]: value,
    });
  }

  function addExp() {
    if (currExp.position !== "") {
      var oldExp = [...allExp];
      oldExp.push(currExp);
      setAllExp(oldExp);
      setCurrExp({ position: "", duration: "", description: "" });
    }
  }

  function removeExp(index) {
    var oldexp = [...allExp];
    const removed = oldexp.splice(index, 1);
    setAllExp(oldexp);
  }

  function removeSkill(index) {
    var oldskill = [...allSkills];
    const removed = oldskill.splice(index, 1);
    setAllSkills(oldskill);
    console.log(allSkills);
  }

  function addSkill() {
    var oldskill = [...allSkills];
    oldskill.push(inSkill);
    setAllSkills(oldskill);
    setInSkill("");
  }

  function save() {
    fetch("/api/user_details", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        skills: allSkills,
        experience: allExp,
      }),
    });
  }

  return (
    <>
      <Layout>
        {initialized ? (
          <>
            <div className="px-8 py-4">
              <label className="block">
                <span className="text-gray-700">Name</span>
                <input
                  className="form-input mt-1 block w-full"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Jane Doe"
                />
              </label>
              <h3 className="pt-4 font-semibold text-lg">Skills</h3>
              <div className="grid gap-2 py-4">
                {allSkills.map((x, index) => (
                  <div className="border border-gray-600 py-2 px-4 rounded grid grid-cols-2">
                    <span>{x}</span>
                    <button
                      className="justify-self-end"
                      onClick={() => removeSkill(index)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-6 w-6 "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <input
                className="form-input"
                value={inSkill}
                onChange={(event) => setInSkill(event.target.value)}
              />
              <button
                className="border border-gray-600 px-4 py-2 ml-4"
                onClick={addSkill}
              >
                Add
              </button>
              <br />
              <h3 className="pt-4 font-semibold text-lg">Work Experience</h3>
              <div className="grid gap-y-4 py-4">
                {allExp.map((x, index) => (
                  <div className="grid grid-cols-2 border border-gray-600 px-4 py-2">
                    <span>{x.position}</span>
                    <button
                      className="justify-self-end"
                      onClick={() => removeExp(index)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-6 w-6 "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <div className="border border-gray-600 px-2 py-4 grid grid-cols-2 gap-x-4 gap-y-2">
                <label>
                  <span>Position</span>
                  <input
                    name="position"
                    value={currExp.position}
                    className="form-input block"
                    onChange={handleExpChange}
                  />
                </label>
                <label>
                  <span>Duration</span>
                  <input
                    name="duration"
                    value={currExp.duration}
                    className="form-input block"
                    onChange={handleExpChange}
                  />
                </label>
                <label>
                  <span>Description</span>
                  <input
                    name="description"
                    value={currExp.description}
                    className="form-input block"
                    onChange={handleExpChange}
                  />
                </label>
                <div className="grid place-items-center">
                  <button
                    className="px-4 py-2 border border-gray-600"
                    onClick={addExp}
                  >
                    Add
                  </button>
                </div>
              </div>

              <button
                className="float-right border border-gray-600 my-2 py-2 px-4 rounded bg-teal-300"
                onClick={save}
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <div className="loader">
            <Spinner />
          </div>
        )}

        <style jsx>{`
          .loader {
            display: flex;
            justify-content: center;
            padding: 3rem;
          }
        `}</style>
      </Layout>

      {initialized && (
        <>
          <h2 className="text-center pt-4 text-2xl">Preview</h2>
          <hr />
          <div className="max-w-xl mx-auto">
            <h1 className="text-center font-semibold text-4xl">{name}</h1>
            <h2 className="text-xl font-semibold">Skills</h2>
            <ul className="list-disc pl-8">
              {allSkills.map((x) => (
                <li>{x}</li>
              ))}
            </ul>
            <h2 className="text-xl font-semibold">Experience</h2>
            {allExp.map((x) => (
              <div className="grid grid-cols-2">
                <h3 className="font-semibold">{x.position}</h3>
                <p className="italic justify-self-end ">{x.duration}</p>
                <p className="col-span-2">{x.description}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
