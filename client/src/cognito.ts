import {
  CognitoIdToken,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js";

export const userPool = new CognitoUserPool({
  ClientId: "t3rc7etonlne28d9mf10ip0ci",
  UserPoolId: "us-east-1_rdB8iu5X4",
});

export const getIdToken = (): Promise<CognitoIdToken> =>
  new Promise((resolve, reject) => {
    const currentUser = userPool.getCurrentUser();
    if (!currentUser) return reject(Error("No current user"));
    currentUser.getSession(
      async (err: Error | void, session: CognitoUserSession) => {
        if (!err) return resolve(session.getIdToken());
        if (err.message === "User does not exist.") {
          currentUser.signOut();
          return reject(Error("No current user"));
        }
        reject(err);
      }
    );
  });
