import React from 'react';

const UserContext = React.createContext({
  isSignedIn: false,
  isSignedOut: false,
  user: {},
  setIsSignedIn: () => {},
  setIsSignedOut: () => {},
});

export {UserContext};
