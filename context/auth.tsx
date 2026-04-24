import { createContext, useContext, useEffect, useState } from "react";
import { kvStore } from "./db";

type User = {
	id: string;
	username: string;
	avatar?: string;
};

type AuthContextType = {
	isLoggedIn: boolean;
	user: User | null;
	login: (user: User) => Promise<void>;
	logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const loadUser = async () => {
			try {
				const loggedIn = await kvStore.getItem("loggedIn");
				const userStr = await kvStore.getItem("user");

				if (loggedIn === "true" && userStr) {
					setUser(JSON.parse(userStr));
					setIsLoggedIn(true);
					console.log("User loaded from storage:", JSON.parse(userStr));
					return;
				}
			} catch (err) {
				console.error("Auth load error:", err);
			}
		};

		loadUser();
	}, []);

	const login = async (userData: User) => {
		await kvStore.setItem("loggedIn", "true");
		await kvStore.setItem("user", JSON.stringify(userData));
		setUser(userData);
		setIsLoggedIn(true);
	};

	const logout = async () => {
		await kvStore.clear();
		setUser(null);
		setIsLoggedIn(false);
	};

	return (
		<AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
