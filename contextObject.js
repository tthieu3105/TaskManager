import { createContext, useState } from 'react';

export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(0);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};