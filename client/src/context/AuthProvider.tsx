import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { User } from "../types";

interface Props {
  children: ReactNode;
}

function getStoredUser(): User | null {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser) as User;
  } catch {
    return null;
  }
}

function getStoredToken(): string | null {
  return localStorage.getItem("token");
}

export default function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(() => getStoredToken());

  const loginUser = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);

    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("token", newToken);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      loginUser,
      logoutUser,
    }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
