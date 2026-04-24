import { StyleSheet, Text, View } from "react-native";

type NoteCardProps = {
	title: string;
	subtitle?: string;
	date: string;
};

export default function NoteCard({ title, subtitle, date }: NoteCardProps) {
	return (
		<View style={styles.card}>
			<Text style={styles.title}>{title}</Text>

			{subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

			<Text style={styles.date}>{date}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#2c2c2c",
		borderRadius: 12,
		padding: 15,
		marginBottom: 12,
	},

	title: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "600",
	},

	subtitle: {
		color: "#ccc",
		marginTop: 5,
	},

	date: {
		color: "#aaa",
		marginTop: 8,
		fontSize: 12,
	},
});
