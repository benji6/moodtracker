import {
  AuthenticationDetails,
  CognitoIdToken,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js";

export const userPool = new CognitoUserPool({
  ClientId: "t3rc7etonlne28d9mf10ip0ci",
  UserPoolId: "us-east-1_rdB8iu5X4",
});

const authenticateUser = ({
  authenticationDetails,
  cognitoUser,
}: {
  authenticationDetails: AuthenticationDetails;
  cognitoUser: CognitoUser;
}): Promise<CognitoUserSession> =>
  new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onFailure: reject,
      onSuccess: resolve,
    });
  });

export const createAuthenticatedUserAndSession = async (
  email: string,
  password: string
): Promise<{
  cognitoUser: CognitoUser;
  cognitoUserSession: CognitoUserSession;
}> => {
  const cognitoUser = createCognitoUser(email);
  const authenticationDetails = new AuthenticationDetails({
    Password: password,
    Username: email,
  });
  const cognitoUserSession = await authenticateUser({
    authenticationDetails,
    cognitoUser,
  });
  return { cognitoUser, cognitoUserSession };
};

export const createCognitoUser = (email: string): CognitoUser =>
  new CognitoUser({ Pool: userPool, Username: email });

export const getIdToken = (): Promise<CognitoIdToken> =>
  new Promise((resolve, reject) => {
    const currentUser = userPool.getCurrentUser();
    if (!currentUser) return reject(Error("No current user"));
    currentUser.getSession(
      (err: Error | void, session: CognitoUserSession | null) => {
        if (!err) return resolve(session!.getIdToken());
        if (err.message === "User does not exist.") {
          currentUser.signOut();
          return reject(Error("No current user"));
        }
        reject(err);
      }
    );
  });
