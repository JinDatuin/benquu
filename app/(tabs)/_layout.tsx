import { Tabs } from "expo-router";
import { Image } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/auth";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
	const colorScheme = useColorScheme();
	const { user } = useAuth();
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				headerShown: false,
				tabBarButton: HapticTab,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => (
						<IconSymbol size={28} name="house.fill" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="explore"
				options={{
					title: "Explore",
					tabBarIcon: ({ color }) => (
						<IconSymbol size={28} name="paperplane.fill" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="your-profile"
				options={{
					title: "You",
					tabBarIcon: ({ color }) =>
						user?.avatar ? (
							<Image
								source={{ uri: user.avatar }}
								style={{ width: 28, height: 28, borderRadius: 14 }}
							/>
						) : (
							<IconSymbol size={28} name="person.circle" color={color} />
						),
				}}
			/>
		</Tabs>
	);
}
