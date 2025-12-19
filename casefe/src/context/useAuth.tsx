"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { JwtPayload } from "../types/JwtPayload";
import OverlayLoader from "../common/overlay-loader";

export type AuthContextType = {
  user: JwtPayload | null;
  setUser: React.Dispatch<React.SetStateAction<JwtPayload | null>> | null;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
    } else {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])) as JwtPayload;
        setUser(payload);
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (err) {
        const error = err as Error;
        setIsAuthenticated(false);
        setIsLoading(false);
        setError(error.message);
      }
    }
  }, []);
  if (!isLoading && error) return <p>{error}</p>;
  if (!isLoading && !isAuthenticated) return <>You are not authenticated</>;
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <> {isLoading ? <OverlayLoader /> : isAuthenticated && children}</>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
