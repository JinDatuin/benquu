import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/auth";

export default function HomeScreen() {
	const { logout, user } = useAuth();
	const router = useRouter();

	const handleSignOut = async () => {
		await logout();
		router.replace("/login");
	};
	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
			headerImage={
				<Image
					source={require("@/assets/images/partial-react-logo.png")}
					style={styles.reactLogo}
				/>
			}
		>
			<ThemedView style={styles.titleContainer}>
				<ThemedText type="title">Your Profile</ThemedText>
				<HelloWave />
			</ThemedView>

			{user && (
				<ThemedView style={styles.profileContainer}>
					<ThemedText type="subtitle">Welcome, {user.username}!</ThemedText>
					{user.avatar && (
						<Image source={{ uri: user.avatar }} style={styles.avatar} />
					)}
					<ThemedText>ID: {user.id}</ThemedText>
				</ThemedView>
			)}

			<ThemedView style={styles.signOutContainer}>
				<Pressable
					style={[styles.signOutButton, styles.signOutButtonPressed]}
					onPress={handleSignOut}
				>
					<ThemedText style={styles.signOutButtonText}>Sign Out</ThemedText>
				</Pressable>
			</ThemedView>
			{/* Removed template content */}
		</ParallaxScrollView>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	profileContainer: {
		gap: 12,
		marginBottom: 20,
		padding: 16,
		borderRadius: 8,
		alignItems: "center",
	},
	avatar: {
		width: 80,
		height: 80,
		borderRadius: 40,
	},
	signOutContainer: {
		marginTop: 20,
		paddingHorizontal: 16,
	},
	signOutButton: {
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#FF6B6B",
	},
	signOutButtonPressed: {
		opacity: 0.7,
	},
	signOutButtonText: {
		color: "white",
		fontWeight: "600",
		fontSize: 16,
	},
	reactLogo: {
		height: 178,
		width: 290,
		bottom: 0,
		left: 0,
		position: "absolute",
	},
});
