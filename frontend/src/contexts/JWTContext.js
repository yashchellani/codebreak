/* eslint-disable*/
import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  isNew: true,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      isNew: user?.isNew,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      isNew: user.isNew,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      isNew: true,
      user,
    };
  },
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  activate: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        // const decoded = jwtDecode(accessToken);
        const valid = await isValidToken(accessToken);
        if (true) {
        // if (accessToken && valid) {
          setSession(accessToken);
          const user = null;
          // let UserDataResponse = null;

          // if (decoded.iss) {
          //   UserDataResponse = await axios.post('/auth/sso-userdata', {
          //     'authorization': accessToken
          //   }).catch((err) => {console.log(err)});
            
          // } else {
          //   const headers = { Authorization: `JWT ${accessToken}` };
          //   UserDataResponse = await axios.get('/auth/users/me', { headers });
          // }
          // const user = UserDataResponse.data;

          // user.is_staff = decoded.is_staff;
          // user.is_superuser = decoded.is_superuser;
          // user.is_user = true;

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
      
    };

    initialize();
    
  }, []);

  const login = async (email, password) => {
    // const accessTokenResponse = await axios.post('/auth/jwt/custom/', {
    //   email,
    //   password,
    // });

    const accessToken = 1;
    // const refreshToken = accessTokenResponse.data.refresh;
    // const headers = { Authorization: `JWT ${accessToken}` };
    // const UserDataResponse = await axios.get('/auth/users/me', { headers });

    const user = 1;
    // setSession(accessToken);
    // localStorage.setItem('refreshToken', refreshToken);

    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  };


  const register = async (email, password, firstName, lastName, date) => {

    const response = await axios.post('auth/users/', {
      'id' : "d4kinxc1ge6le80v8z89",
      'email': email,
      'password': password,
      're_password': password,
      'first_name': firstName,
      'last_name': lastName,
      'birthdate': date
    });

    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
     
  };

  const activate = async (uid, token) => {
    await axios.post('/auth/users/activation/', {
      "uid": uid,
      'token': token,
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        activate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
