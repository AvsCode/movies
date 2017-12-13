import {
    CognitoUserPool,
    AuthenticationDetails,
    CognitoUser
} from "amazon-cognito-identity-js";
import serverApi from './serverApi.js';
import appApi from './appApi.js';
import AWS from "aws-sdk";
import cognitoConfig from '../../secrets/cognitoConfig.js';
import sigV4Client from "./sigV4Client";

const cognitoApi = (function () {
    function signUp(email, password) {
        const userPool = new CognitoUserPool({
            UserPoolId: cognitoConfig.USER_POOL_ID,
            ClientId: cognitoConfig.APP_CLIENT_ID
        });

        userPool.signUp(email, password, [], null, (err, result) => {
            if (err) {
                console.log(err);
                signIn(email, password, userPool);
                return;
            } else {
                alert(`user ${result.user.getUsername()}created - please check your email to confirm`);
            }
            let cognitoUser = result.user;
        });
    }

    function signIn(email, password, userPool) {
        const user = new CognitoUser({
            Username: email,
            Pool: userPool
        });
        const authenticationData = {
            Username: email,
            Password: password
        }
        const authenticationDetails = new AuthenticationDetails(authenticationData);
        user.authenticateUser(authenticationDetails, {
            onSuccess: async(result) => {
                console.log(result);
                let tempMovies = await serverApi.getMovieRatings();
                appApi.setRecommendedMovies(tempMovies);
                appApi.buildRecommendedMovies(tempMovies);
            },
            onFailure: (err) => {
                console.log(err);
            }
        });
    }

    function signIn2(email, password) {
        const userPool = new CognitoUserPool({
            UserPoolId: cognitoConfig.USER_POOL_ID,
            ClientId: cognitoConfig.APP_CLIENT_ID
        });
        const user = new CognitoUser({
            Username: email,
            Pool: userPool
        });
        const authenticationData = {
            Username: email,
            Password: password
        };
        const authenticationDetails = new AuthenticationDetails(authenticationData);
        return new Promise((resolve, reject) => {
            user.authenticateUser(authenticationDetails, {
                onSuccess: (result) => {
                    console.log(result);
                    resolve();
                },
                onFailure: (err) => {
                    console.log(err);
                    reject();
                }
            });
        });
    }
    // 
    async function authUser() {
        if (AWS.config.credentials && Date.now() < AWS.config.credentials.expireTime - 60000) {
            return true;
        }

        const currentUser = getCurrentUser();
        if (currentUser === null) {
            return false;
        }
        const userToken = await getUserToken(currentUser);
        await getAWSCredentials(userToken);
        return true;
    }

    function getAWSCredentials(userToken) {
        const authenticator = `cognito-idp.${cognitoConfig.REGION}.amazonaws.com/${cognitoConfig.USER_POOL_ID}`;
        AWS.config.update({
            region: cognitoConfig.REGION
        });
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: cognitoConfig.IDENTITY_POOL_ID,
            Logins: {
                [authenticator]: userToken
            }
        });
        return AWS.config.credentials.getPromise();
    }

    function getUserToken(currentUser) {
        return new Promise((resolve, reject) => {
            currentUser.getSession(function (err, session) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(session.getIdToken().getJwtToken());
            });
        });
    }

    function getCurrentUser() {
        const userPool = new CognitoUserPool({
            UserPoolId: cognitoConfig.USER_POOL_ID,
            ClientId: cognitoConfig.APP_CLIENT_ID
        });
        return userPool.getCurrentUser();
    }

    async function invokeApig({
        path,
        method = "GET",
        headers = {},
        queryParams = {},
        body
    }) {
        if (!await authUser()) {
            throw new Error("User is not logged in");
        }
        const signedRequest = sigV4Client.newClient({
                accessKey: AWS.config.credentials.accessKeyId,
                secretKey: AWS.config.credentials.secretAccessKey,
                sessionToken: AWS.config.credentials.sessionToken,
                region: cognitoConfig.API_GATEWAY_REGION,
                endpoint: cognitoConfig.API_GATEWAY_URL
            })
            .signRequest({
                method,
                path,
                headers,
                queryParams,
                body
            });
        body = body ? JSON.stringify(body) : body;
        headers = signedRequest.headers;
        const results = await fetch(signedRequest.url, {
            method,
            headers,
            body
        });
        if (results.status !== 200) {
            throw new Error(await results.text());
        }
        return results.json();
    }
    return {
        signUp,
        invokeApig,
        signIn2
    }
})();

export default cognitoApi;