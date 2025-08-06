// context/authcontext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, firestore } from "../config/firebase";
import { backendService } from "../services/backendauth";
import { AuthContextType, UserType } from "../types";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserType>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Ambil ID token dari Firebase
                    const idToken = await firebaseUser.getIdToken();

                    await AsyncStorage.setItem('authToken', idToken);
                    console.log("Firebase user authenticated:", firebaseUser.uid);
                    
                    // Verifikasi dengan backend
                    const backendResponse = await backendService.loginUser(idToken);
                    
                    if (backendResponse.success && backendResponse.user) {
                        // Set user data dari backend response
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            name: backendResponse.user.name,
                            backendUserId: backendResponse.user.id, // ID dari database backend
                        });
                        console.log("User authenticated with backend:", backendResponse.user);
                        router.replace("/main");
                    } else {
                        console.error("Backend authentication failed:", backendResponse.message);
                        // Fallback ke Firestore jika backend gagal
                        await handleFirestoreFallback(firebaseUser);
                    }
                } catch (error) {
                    console.error("Error during auth state change:", error);
                    await handleFirestoreFallback(firebaseUser);
                }
            } else {
                setUser(null);
                router.replace("/auth/welcome");
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleFirestoreFallback = async (firebaseUser: any) => {
        try {
            const userDoc = await getDoc(doc(firestore, "users", firebaseUser.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: userData.name || firebaseUser.displayName,
                });
                console.log("Using Firestore fallback data:", userData);
                router.replace("/main");
            } else {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName,
                });
                router.replace("/main");
            }
        } catch (error) {
            console.error("Firestore fallback error:", error);
            setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName,
            });
            router.replace("/main");
        }
    };

    const login = async (email: string, password: string) => {
        try {
            // 1. Login ke Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;
            // 2. Ambil ID token
            const idToken = await userCredential.user.getIdToken();

            await AsyncStorage.setItem('authToken', idToken);
            await AsyncStorage.setItem('userId', userId.toString());
            const testUserId = await AsyncStorage.getItem('userId');
            console.log('Saved userId:', testUserId);


            console.log("Firebase login successful, token obtained");
            
            // 3. Kirim token ke backend untuk verifikasi
            const backendResponse = await backendService.loginUser(idToken);
            
            if (backendResponse.success && backendResponse.user) {
                // 4. Set user data dari backend
                setUser({
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                    name: backendResponse.user.name,
                    backendUserId: backendResponse.user.id,
                });
                console.log("Backend login successful:", backendResponse.user);
                return { success: true, msg: backendResponse.message };
            } else {
                console.error("Backend login failed:", backendResponse.message);
                return { success: false, msg: backendResponse.message || 'Backend authentication failed' };
            }
            
        } catch (error: any) {
            console.error("Login error:", error);
            let msg = error.message;
            
            // Handle specific Firebase auth errors
            if (error.code === "auth/invalid-credential" || 
                error.code === "auth/wrong-password" || 
                error.code === "auth/user-not-found") {
                msg = "Email atau password salah";
            } else if (error.code === "auth/too-many-requests") {
                msg = "Terlalu banyak percobaan login. Coba lagi nanti";
            }
            
            return { success: false, msg };
        }
    };

    const register = async (name: string, email: string, password: string) => {
        let firebaseUser = null;
    
        try {
            console.log("Starting Firebase registration...");
            const firebaseResponse = await createUserWithEmailAndPassword(auth, email, password);
            firebaseUser = firebaseResponse.user;
            console.log("Firebase registration successful:", firebaseUser.uid);
            
            await updateProfile(firebaseUser, { displayName: name });
            console.log("Firebase profile updated with name:", name);
            
            try {
                await setDoc(doc(firestore, "users", firebaseUser.uid), {
                    name,
                    email,
                    uid: firebaseUser.uid,
                    createdAt: new Date(),
                    backendSynced: false 
                });
                console.log("User data saved to Firestore");
            } catch (firestoreError) {
                console.warn("Firestore save failed, but continuing:", firestoreError);
            }
            
            console.log("Starting backend registration...");
            const backendResponse = await backendService.registerUser(
                firebaseUser.uid,
                name,
                email,
                password
            );
            
            if (backendResponse.success) {
                console.log("Backend registration successful");
                
                try {
                    await setDoc(doc(firestore, "users", firebaseUser.uid), {
                        name,
                        email,
                        uid: firebaseUser.uid,
                        createdAt: new Date(),
                        backendSynced: true,
                        backendUserId: backendResponse.user?.id
                    });
                    console.log("Firestore updated with backend sync status");
                } catch (firestoreError) {
                    console.warn("Failed to update Firestore sync status:", firestoreError);
                }
                
                console.log("Registration completely successful for:", name);
                return { 
                    success: true, 
                    msg: backendResponse.message || "Registrasi berhasil!"
                };
                
            } else {
                console.error("Backend registration failed:", backendResponse.message);
                console.log("User remains in Firebase despite backend failure");
                return { 
                    success: false, 
                    msg: `Akun Firebase berhasil dibuat, tapi backend gagal: ${backendResponse.message || 'Backend registration failed'}. Silakan coba login atau hubungi admin.`
                };
            }
            
        } catch (error: any) {
            console.error("Registration error:", error);
        
            if (!firebaseUser) {
                console.log("Firebase registration failed, no cleanup needed");
            } else {
                console.log("Firebase user exists despite error, keeping it");
            }
            
            let msg = error.message;
            if (error.code === "auth/email-already-in-use") {
                msg = "Email sudah digunakan. Silakan gunakan email lain";
            } else if (error.code === "auth/weak-password") {
                msg = "Password terlalu lemah. Minimal 6 karakter";
            } else if (error.code === "auth/invalid-email") {
                msg = "Format email tidak valid";
            } else if (error.code === "auth/network-request-failed") {
                msg = "Masalah koneksi internet. Silakan coba lagi";
            }
            return { success: false, msg };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            await AsyncStorage.removeItem('authToken'); 
            setUser(null);
            console.log("User logged out");
            return { success: true };
        } catch (error: any) {
            console.error("Error signing out:", error);
            let msg = error.message;
            return { success: false, msg };
        }
    };

    const contextValue: AuthContextType = {
        user,
        setUser,
        login,
        register,
        logout,
        loading
    }

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};