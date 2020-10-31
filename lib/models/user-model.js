import { q, adminClient, getClient } from "../faunadb";

export class UserModel {
  async createUser(email) {
    return adminClient.query(
      q.Create(q.Collection("users"), {
        data: { email },
      })
    );
  }

  async updateUser(token, data) {
    await getClient(token).query(
      q.Update(q.Identity(), {
        data: data,
      })
    );
  }

  async getUserByEmail(email) {
    /* Step 4.3: Get a user by their email in FaunaDB */
    return adminClient
      .query(q.Get(q.Match(q.Index("users_by_email"), email)))
      .catch(() => undefined);
  }

  async obtainFaunaDBToken(user) {
    /* Step 4.3: Obtain a FaunaDB access token for the user */
    return adminClient
      .query(q.Create(q.Tokens(), { instance: q.Select("ref", user) }))
      .then((res) => res?.secret)
      .catch(() => undefined);
  }

  async invalidateFaunaDBToken(token) {
    /* Step 4.3: Invalidate a FaunaDB access token for the user */
    await getClient(token).query(q.Logout(true));
  }
}
