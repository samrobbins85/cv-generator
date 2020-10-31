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
  const isFirstRender = useFirstRender();

  const { user, loading: userLoading } = useUser();
  console.log(user);
  const { todos, loading: todosLoading, mutate: mutateTodos } = useAllTodos();

  useEffect(() => {
    // Flag initialization complete,
    // this will hide the loading state.
    if (user && !userLoading && !todosLoading && !initialized) {
      setInitialized(true);
    }
  }, [user, userLoading, todosLoading, initialized]);

  useEffect(() => {
    // If no user is logged in, redirect
    // to the `/login` page automatically.
    if (!(user || userLoading) && !isFirstRender) {
      router.push("/login");
    }
  }, [user, userLoading]);

  const [filter, setFilter] = useState("all");
  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case "active":
        return !todo.completed;

      case "completed":
        return todo.completed;

      case "all":
      default:
        return true;
    }
  });

  const hasCompletedTodos = !!todos.find((todo) => todo.completed);

  const clearCompletedTodos = useCallback(() => {
    mutateTodos(
      (currTodos) => currTodos.filter((todo) => !todo.completed),
      false
    );
    fetch("/api/todos", { method: "DELETE" }).then(() => mutateTodos());
  }, []);

  function changeName(event) {
    fetch("/api/user_details", {
      method: "POST",
      body: JSON.stringify({ name: name }),
    });
  }

  function addSkill() {
    var oldskill = allSkills;
    oldskill.push(inSkill);
    setAllSkills(oldskill);
    setInSkill("");
  }

  function saveSkills() {
    fetch("/api/user_details", {
      method: "POST",
      body: JSON.stringify({ skills: allSkills }),
    });
  }

  return (
    <>
      <Layout>
        {initialized ? (
          <>
            <div className="px-8 py-4">
              <form onSubmit={changeName}>
                <label className="block">
                  <span className="text-gray-700">Name</span>
                  <input
                    className="form-input mt-1 block w-full"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Jane Doe"
                  />
                </label>
                <input
                  className="border border-gray-600 px-4 py-2 rounded"
                  type="submit"
                  value="Submit"
                />
              </form>
              <h3 className="pt-4 font-semibold text-lg">Skills</h3>
              <div>Skills go here</div>
              <input
                className="form-input"
                value={inSkill}
                onChange={(event) => setInSkill(event.target.value)}
              />
              <button
                className="border border-gray-600 px-4 py-2 ml-4"
                onClick={addSkill}
              >
                Submit
              </button>
              <br />
              <button onClick={saveSkills}>Save</button>
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
          <div className="container mx-auto">
            <h1 className="text-center font-semibold text-4xl">{name}</h1>
            <h2 className="text-xl font-semibold">Skills</h2>
            <ul className="list-disc pl-8">
              {allSkills.map((x) => (
                <li>{x}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
}
