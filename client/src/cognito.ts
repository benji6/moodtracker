import {
  AuthenticationDetails,
  CognitoIdToken,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import { AWS_CONSTANTS } from "./constants";

export const userPool = new CognitoUserPool({
  ClientId: "t3rc7etonlne28d9mf10ip0ci",
  UserPoolId: AWS_CONSTANTS.cognitoUserPoolId,
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

const getCurrentUser = (): CognitoUser => {
  const currentUser = userPool.getCurrentUser();
  if (currentUser) return currentUser;
  throw Error("No current user");
};

const getSession = (user: CognitoUser): Promise<CognitoUserSession> =>
  new Promise((resolve, reject) => {
    user.getSession((error: Error | null, session: CognitoUserSession) => {
      if (error) return reject(error);
      resolve(session);
    });
  });

export const changeEmail = async (newEmailAddress: string): Promise<void> => {
  const currentUser = getCurrentUser();
  await getSession(currentUser);
  return new Promise((resolve, reject) => {
    currentUser.updateAttributes(
      [
        new CognitoUserAttribute({
          Name: "email",
          Value: newEmailAddress,
        }),
      ],
      (error) => {
        if (error) return reject(error);
        resolve();
      }
    );
  });
};

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
    const currentUser = getCurrentUser();
    getSession(currentUser).then(
      (session) => resolve(session.getIdToken()),
      (error) => {
        if (error.message === "User does not exist.") {
          currentUser.signOut();
          return reject(Error("No current user"));
        }
        reject(error);
      }
    );
  });

export const refreshSession = async (): Promise<CognitoUserSession> => {
  const currentUser = getCurrentUser();
  const session = await getSession(currentUser);
  const refreshToken = session.getRefreshToken();
  return new Promise((resolve, reject) =>
    currentUser.refreshSession(refreshToken, (error, session) => {
      if (error) return reject(error);
      resolve(session);
    })
  );
};

export const verifyNewEmail = async (
  verificationCode: string
): Promise<void> => {
  const currentUser = getCurrentUser();
  await getSession(currentUser);
  return new Promise((resolve, reject) => {
    currentUser.verifyAttribute("email", verificationCode, {
      onSuccess: () => resolve(),
      onFailure: reject,
    });
  });
};
