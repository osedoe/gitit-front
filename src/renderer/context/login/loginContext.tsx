import React, { useContext, useReducer } from 'react';
import { loginReducer, LoginState } from './loginReducer';
import { LoginCredentials } from '../../utils';
import { UserStore } from '../../models';

export const INITIAL_LOGIN_STATE: LoginState = {
  email: '',
  githubToken: '',
  authHeader: '',
  isAuthenticated: false
};

const LoginContext = React.createContext(null);

export const LoginProvider = ({ children }) => {
  const [state, dispatch] = useReducer(loginReducer, INITIAL_LOGIN_STATE);

  return <LoginContext.Provider value={[state, dispatch]}>{children}</LoginContext.Provider>;
};


interface LoginContext {
  state: LoginState;
  dispatch: () => void;
  dispatchSetAuthHeader: (credentials: LoginCredentials) => void;
  dispatchInitializeLocalUser: (user: UserStore) => void;
}

export const useLoginContext = (): LoginContext => {
  const context = useContext(LoginContext);

  if (!context) {
    throw new Error('Context not found...');
  }

  const [state, dispatch] = context;

  return {
    state,
    dispatch,
    dispatchSetAuthHeader: (credentials: LoginCredentials) => {
      const { email, githubToken } = credentials;
      dispatch({ type: 'CONFIG_SET_AUTH_TOKEN', email, githubToken });
    },
    dispatchInitializeLocalUser: (user: UserStore) => {
      dispatch({ type: 'INIT_USER', user });
    }
  };
};
