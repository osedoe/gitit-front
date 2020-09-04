import React, { FC, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Config, githubRequest, OAuthConfig } from "../utils";
import { useLoginContext } from "../context/login/loginContext";

/**
 * @deprecated
 */
const GITHUB_URL = "https://github.com/login/oauth/authorize";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
`;

const Button = styled.button``;

const sendGuestNotification = () =>
  new Notification("Test", {
    body: "You are not logged in"
  });

const sendLoggedOnNotification = () => new Notification("Logged on");

export const Login: FC = () => {
  const areCredentialsStored = Boolean(Config.getAuthHeader());
  const [hasAuth, setHasAuth] = useState(areCredentialsStored);
  const [tokenValue, setTokenValue] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const { state, dispatchSetAuthToken } = useLoginContext();

  useEffect(() => {
    if (!hasAuth) {
      sendGuestNotification();
    }
  }, [hasAuth]);

  const handleLogin = async () => {
    try {
      const response = await githubRequest("user", {
        Authorization: `Basic ${btoa(`${email}:${tokenValue}`)}`
      });
      // TODO: Feedback to user
      console.log("Successfully logged!!!", response);
      sendLoggedOnNotification();
    } catch (error) {
      // TODO: Feedback to user
      console.error("There's been an error trying to authenticate your user", error);
    }

    dispatchSetAuthToken({ username: email, token: tokenValue });
  };

  const handleReviewAccess = () => {
    fetch(`settings/connections/applications/${OAuthConfig.clientId}`)
      .then(console.log)
      .catch(console.error);
  };

  const handleEmailChange = ({ currentTarget }) => setEmail(currentTarget.value);
  const handleTokenChange = ({ currentTarget }) => setTokenValue(currentTarget.value);

  if (hasAuth) {
    // TODO: Review this view
    return <Container>
      <h2>You are logged in</h2>
      <button onClick={handleReviewAccess}>REVIEW ACCESS</button>
    </Container>;
  }

  return <Container>
    <h2>
      Type in your GitHub email and create a personal access token to allow permissions
      for the app:
    </h2>
    <label aria-labelledby="email" htmlFor="email">
      Github email:
      <input id="email" name="email" value={email} onChange={handleEmailChange}/>
    </label>
    <label htmlFor="token">
      Github token:
      <input id="token" name="token" value={tokenValue} onChange={handleTokenChange}/>
    </label>
    <Button aria-label="login button" onClick={handleLogin}>
      LOGIN
    </Button>
  </Container>;
};
