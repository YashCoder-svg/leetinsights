"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isMock: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isMock = !isFirebaseConfigured;

  useEffect(() => {
    if (!isMock && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Simulation mode mount setup
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("leetinsight_mock_user");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            localStorage.removeItem("leetinsight_mock_user");
          }
        }
      }
      setLoading(false);
    }
  }, [isMock]);

  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (!isMock && auth) {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        if (credential.user) {
          setUser({
            uid: credential.user.uid,
            email: credential.user.email,
            displayName: credential.user.displayName,
            photoURL: credential.user.photoURL,
          });
        }
      } else {
        // Mock Login
        const mockDb = localStorage.getItem("leetinsight_mock_db");
        const users = mockDb ? JSON.parse(mockDb) : [];
        const matchedUser = users.find(
          (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (!matchedUser) {
          throw new Error("Invalid email or password.");
        }

        const loggedInUser: User = {
          uid: matchedUser.uid,
          email: matchedUser.email,
          displayName: matchedUser.displayName,
          photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(matchedUser.displayName)}`,
        };

        localStorage.setItem("leetinsight_mock_user", JSON.stringify(loggedInUser));
        setUser(loggedInUser);
      }
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      if (!isMock && auth) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName: name });
        setUser({
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: name,
          photoURL: credential.user.photoURL,
        });
      } else {
        // Mock Register
        const mockDb = localStorage.getItem("leetinsight_mock_db");
        const users = mockDb ? JSON.parse(mockDb) : [];
        
        if (users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
          throw new Error("Email already in use.");
        }

        const newUserRecord = {
          uid: `mock_${Date.now()}`,
          email,
          password,
          displayName: name,
        };

        users.push(newUserRecord);
        localStorage.setItem("leetinsight_mock_db", JSON.stringify(users));

        const loggedInUser: User = {
          uid: newUserRecord.uid,
          email: newUserRecord.email,
          displayName: newUserRecord.displayName,
          photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(newUserRecord.displayName)}`,
        };

        localStorage.setItem("leetinsight_mock_user", JSON.stringify(loggedInUser));
        setUser(loggedInUser);
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      if (!isMock && auth) {
        const provider = new GoogleAuthProvider();
        const credential = await signInWithPopup(auth, provider);
        if (credential.user) {
          setUser({
            uid: credential.user.uid,
            email: credential.user.email,
            displayName: credential.user.displayName,
            photoURL: credential.user.photoURL,
          });
        }
      } else {
        // Mock Google Login
        const mockGoogleUser: User = {
          uid: "mock_google_12345",
          email: "john.doe@example.com",
          displayName: "John Doe",
          photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=JohnDoe",
        };
        localStorage.setItem("leetinsight_mock_user", JSON.stringify(mockGoogleUser));
        setUser(mockGoogleUser);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (!isMock && auth) {
        await signOut(auth);
      } else {
        localStorage.removeItem("leetinsight_mock_user");
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      if (!isMock && auth) {
        await sendPasswordResetEmail(auth, email);
      } else {
        // Mock reset password
        const mockDb = localStorage.getItem("leetinsight_mock_db");
        const users = mockDb ? JSON.parse(mockDb) : [];
        const userExists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase()) || email === "john.doe@example.com";
        if (!userExists) {
          throw new Error("No user registered with this email.");
        }
        console.log(`[MOCK MODE] Reset link successfully requested for: ${email}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isMock,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
