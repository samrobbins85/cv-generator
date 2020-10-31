import { getSession } from "../../lib/auth-cookies";
import { UserModel } from "../../lib/models/user-model";

export default async function user(req, res) {
  const session = await getSession(req);

  if (session) {
    const { email, issuer } = session;
    const model = new UserModel(session);
    const user = await model.getUserByEmail(email);
    res.status(200).json({ user: { email, issuer, user } });
  } else {
    res.status(200).json({ user: null });
  }
}
