import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

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
				const loggedIn = await AsyncStorage.getItem("loggedIn");
				const userStr = await AsyncStorage.getItem("user");

				if (loggedIn === "true" && userStr) {
					setUser(JSON.parse(userStr));
					setIsLoggedIn(true);
					return;
				}

				// DEV ONLY fallback
				if (__DEV__) {
					const devUser: User = {
						id: "discord_1234567890",
						username: "DevUser",
						avatar: "https://cdn.discordapp.com/embed/avatars/0.png",
					};

					await AsyncStorage.setItem("loggedIn", "true");
					await AsyncStorage.setItem("user", JSON.stringify(devUser));

					setUser(devUser);
					setIsLoggedIn(true);
				}
			} catch (err) {
				console.error("Auth load error:", err);
			}
		};

		loadUser();
	}, []);

	const login = async (userData: User) => {
		await AsyncStorage.setItem("loggedIn", "true");
		await AsyncStorage.setItem("user", JSON.stringify(userData));
		setUser(userData);
		setIsLoggedIn(true);
	};

	const logout = async () => {
		await AsyncStorage.removeItem("loggedIn");
		await AsyncStorage.removeItem("user");
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
