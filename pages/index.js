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
  const isFirstRender = useFirstRender();

  const { user, loading: userLoading } = useUser();
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

  function changeName(event) {}

  return (
    <>
      <Layout>
        {initialized ? (
          <>
            {/* <AddTodo todos={todos} mutateTodos={mutateTodos} />
        {filteredTodos.map(todo => <TodoItem mutateTodos={mutateTodos} {...todo} key={todo.id} /> )}
        {!!todos.length && (<div className="actions">
          <div className="filters">
            <div><Button isActive={filter === 'all'} onClick={() => setFilter('all')}>All</Button></div>
            <div><Button isActive={filter === 'completed'} onClick={() => setFilter('completed')}>Completed</Button></div>
            <div><Button isActive={filter === 'active'} onClick={() => setFilter('active')}>Active</Button></div>
          </div>

          <Button
            disabled={!hasCompletedTodos}
            className="clear-completed"
            onClick={clearCompletedTodos}>
              Clear Completed
          </Button>
        </div>)} */}
            <form className="px-8 py-4" onSubmit={changeName}>
              <label className="block">
                <span className="text-gray-700">Name</span>
                <input
                  className="form-input mt-1 block w-full"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Jane Doe"
                />
              </label>
            </form>
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
          <div>
            <h1 className="text-center font-semibold text-4xl">{name}</h1>
          </div>
        </>
      )}
    </>
  );
}
