import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getUserByUid, syncUser } from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("user"); // default role

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        // Add a small delay to prevent rapid successive calls
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Fetch user role and profile data from backend with retry logic
        try {
          const res = await getUserByUid(currentUser.uid);
          const userData = res.data;
          setRole(userData.role || "user");
          
          // Update user with backend data
          const updatedUser = {
            ...currentUser,
            displayName: userData.displayName || currentUser.displayName,
            phone: userData.phone,
            address: userData.address
          };
          setUser(updatedUser);
        } catch (error) {
          console.error('Error loading user data from backend:', error);
          // Don't retry immediately, just set default role
          setRole("user");
        }
      } else {
        setRole("user");
      }
    });
    return () => unsubscribe();
  }, []);

  const register = async (name, email, password, photoURL) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: name, photoURL });
    setUser({ ...res.user });
    return res.user;
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    setUser(res.user);
    // Sync user to DB
    await syncUser({
      uid: res.user.uid,
      email: res.user.email,
      name: res.user.displayName,
      photo: res.user.photoURL
      // role: "user" // এটি আর পাঠানো হবে না
    });
    return res.user;
  };

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const updateUser = (updatedUserData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedUserData
    }));
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    googleSignIn,
    resetPassword,
    role,
    setRole,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 