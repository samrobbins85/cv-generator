import { createHandlers } from "../../lib/rest-utils";
import { UserModel } from "../../lib/models/user-model";
import { getSession } from "../../lib/auth-cookies";

const handlers = {
  GET: async (req, res) => {
    const model = new UserModel();
    const user = await model.getUserByEmail(req.query.email);
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ available: false });
    }
  },
  POST: async (req, res) => {
    const { token } = await getSession(req);
    const model = new UserModel(token);
    const data = JSON.parse(req.body);
    await model.updateUser(token, data);
    res.status(200).json({ done: true });
  },
};

export default function user_details(req, res) {
  const handler = createHandlers(handlers);
  return handler(req, res);
}
