import { useAuth } from "@/context/auth";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const unstable_settings = {
	headerShown: false,
};

const DISCORD_CLIENT_ID = process.env.EXPO_PUBLIC_DISCORD_CLIENT_ID || "";
const REDIRECT_URI = AuthSession.makeRedirectUri();

const discovery = {
	authorizationEndpoint: "https://discord.com/oauth2/authorize",
	tokenEndpoint: "https://discord.com/api/oauth2/token",
};

export default function LoginScreen() {
	const { login } = useAuth();
	const router = useRouter();

	const [request, response, promptAsync] = AuthSession.useAuthRequest(
		{
			clientId: DISCORD_CLIENT_ID,
			scopes: ["identify", "guilds"],
			redirectUri: REDIRECT_URI,
			responseType: AuthSession.ResponseType.Code,
			usePKCE: true,
		},
		discovery,
	);

	useEffect(() => {
		if (response?.type === "success") {
			const { code } = response.params;
			exchangeCode(code);
		}
	}, [response]);

	const exchangeCode = async (code: string) => {
		try {
			const tokenResult = await AuthSession.exchangeCodeAsync(
				{
					clientId: DISCORD_CLIENT_ID,
					code,
					redirectUri: REDIRECT_URI,
					extraParams: {
						code_verifier: request?.codeVerifier || "",
					},
				},
				discovery,
			);

			const accessToken = tokenResult.accessToken;

			const userRes = await fetch("https://discord.com/api/users/@me", {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const userData = await userRes.json();

			const user = {
				id: userData.id,
				username: userData.username,
				avatar: userData.avatar
					? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
					: undefined,
				accessToken,
			};

			await login(user);
			router.replace("/(tabs)");
		} catch (err) {
			console.error("Discord login failed:", err);
		}
	};

	const handleDiscordLogin = () => {
		if (request) {
			promptAsync();
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Welcome</Text>

			<TouchableOpacity
				style={styles.discordButton}
				onPress={handleDiscordLogin}
				disabled={!request}
			>
				<Text style={styles.discordButtonText}>Login with Discord</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 24,
	},
	title: {
		fontSize: 32,
		fontWeight: "700",
	},
	discordButton: {
		backgroundColor: "#5865F2",
		paddingVertical: 12,
		paddingHorizontal: 32,
		borderRadius: 8,
	},
	discordButtonText: {
		color: "#fff",
		fontWeight: "700",
		fontSize: 16,
	},
});
