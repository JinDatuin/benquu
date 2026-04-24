import {
	FlatList,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
} from "react-native";

import NoteCard from "@/components/note-card";

type Note = {
	id: string;
	title: string;
	subtitle?: string;
	date: string;
};

const notes: Note[] = [
	{
		id: "1",
		title: "Project Benquu",
		subtitle: "Discord",
		date: "11:35 AM",
	},
	{
		id: "1",
		title: "Project Benquu",
		subtitle: "Discord",
		date: "11:35 AM",
	},
	{
		id: "1",
		title: "Project Benquu",
		subtitle: "Discord",
		date: "11:35 AM",
	},
	{
		id: "1",
		title: "Project Benquu",
		subtitle: "Discord",
		date: "11:35 AM",
	},
	{
		id: "1",
		title: "Project Benquu",
		subtitle: "Discord",
		date: "11:35 AM",
	},
	{
		id: "1",
		title: "Project Benquu",
		subtitle: "Discord",
		date: "11:35 AM",
	},
	{
		id: "1",
		title: "Project Benquu",
		subtitle: "Discord",
		date: "11:35 AM",
	},
	{
		id: "2",
		title: "zyrllnrn",
		date: "April 16",
	},
	{
		id: "3",
		title: "https://cooper.outsoar.it.com/admin",
		subtitle: "ashley@outsoar.ph",
		date: "April 10",
	},
	{
		id: "4",
		title: "きゆ",
		date: "March 23",
	},
	{
		id: "5",
		title: "Order",
		subtitle: "My Money",
		date: "March 15",
	},
	{
		id: "6",
		title: "SER",
		date: "March 1",
	},
];

export default function HomeScreen() {
	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.header}>Notes</Text>

			<FlatList
				data={notes}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <NoteCard {...item} />}
				contentContainerStyle={{ flexGrow: 1 }}
				ListEmptyComponent={<Text style={styles.emptyText}>No Notes</Text>}
			/>

			<TouchableOpacity style={styles.fab}>
				<Text style={styles.fabText}>+</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000",
		paddingHorizontal: 15,
		paddingTop: 20,
	},

	header: {
		fontSize: 34,
		color: "#fff",
		fontWeight: "bold",
		marginVertical: 20,
	},

	fab: {
		position: "absolute",
		right: 25,
		bottom: 25,
		backgroundColor: "#8ea2ff",
		width: 60,
		height: 60,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
	},

	fabText: {
		color: "#fff",
		fontSize: 28,
	},

	emptyText: {
		color: "#888",
		fontSize: 18,
		textAlign: "center",
		marginTop: "75%",
	},
});
