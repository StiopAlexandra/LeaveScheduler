import jwtDecode from 'jwt-decode';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import UserContext from '../../contexts/UserContext';

const UserProvider = ({ children, authToken, authUser }) => {
  const [user, setUser] = useState(null);

  const signOut = useCallback(() => {
    localStorage.removeItem(authToken);
    localStorage.removeItem(authUser);
    setUser(null);
  }, [setUser]);

  const signIn = useCallback(
    (user, token) => {
      localStorage.setItem(authToken, token);
      localStorage.setItem(authUser, JSON.stringify(user));
      setUser(user);
    },
    [setUser]
  );

  useEffect(() => {
    const token = localStorage.getItem(authToken);
    if (token) {
      if (jwtDecode(token).exp * 1000 < Date.now()) {
        signOut();
      } else {
        const user = localStorage.getItem(authUser);
        const decodedUser = JSON.parse(user);
        setUser(decodedUser);
      }
    }
  }, [signOut, setUser]);

  const contextValue = useMemo(
    () => ({
      signIn,
      signOut,
      user
    }),
    [signIn, signOut, user]
  );

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export default UserProvider;
