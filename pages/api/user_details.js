import { createHandlers } from "../../lib/rest-utils";
import { UserModel } from "../../lib/models/user-model";
import { getSession } from "../../lib/auth-cookies";

const handlers = {
  // GET: async (req, res) => {
  //   const { token } = await getSession(req);
  //   const model = new UserModel(token);
  //   const user = await model.getUserByEmail(req.query.email);
  //   const other = await model.updateUser();
  //   res.status(200).json({ user });
  // },
  POST: async (req, res) => {
    const { token } = await getSession(req);
    const model = new UserModel(token);
    const data = JSON.parse(req.body);
    await model.updateUser(token, data);
    console.log("Hit");
    res.status(200).json({ done: true });
  },

  // GET: async (req, res) => {
  //   const { token } = await getSession(req);
  //   const model = new UserModel(token);
  //   await model.updateUser(token);
  //   res.status(200).json({ done: true });
  // },

  //   DELETE: async (req, res) => {
  //     const { token } = await getSession(req);
  //     const model = new TodoModel(token);
  //     await model.deleteCompletedTodos();
  //     res.status(200).json({ done: true });
  //   },
};

export default function user_details(req, res) {
  const handler = createHandlers(handlers);
  return handler(req, res);
}
