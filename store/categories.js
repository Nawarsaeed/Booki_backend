const categories = [
	{
		id: 1,
		name: "Computer S",
		icon: "monitor-screenshot",
		backgroundColor: "#fc5c65",
		color: "white",
	},
	{
		id: 2,
		name: "Physics",
		icon: "atom",
		backgroundColor: "#fd9644",
		color: "white",
	},
	{
		id: 3,
		name: "Law",
		icon: "scale-balance",
		backgroundColor: "#fed330",
		color: "white",
	},
	{
		id: 4,
		name: "socionom",
		icon: "account-supervisor-circle",
		backgroundColor: "#26de81",
		color: "white",
	},
	{
		id: 5,
		name: "Teach",
		icon: "teach",
		backgroundColor: "#2bcbba",
		color: "white",
	},
	{
		id: 6,
		name: "Sports",
		icon: "basketball",
		backgroundColor: "#45aaf2",
		color: "white",
	},
	{
		id: 7,
		name: "Economy",
		icon: "chart-bell-curve",
		backgroundColor: "#4b7bec",
		color: "white",
	},
	{
		id: 8,
		name: "Mathematics",
		icon: "calculator-variant",
		backgroundColor: "#a55eea",
		color: "white",
	},
	{
		id: 9,
		name: "Other",
		icon: "application",
		backgroundColor: "#778ca3",
		color: "white",
	},
];

const getCategories = () => categories;

const getCategory = (id) => categories.find((c) => c.id === id);

module.exports = {
	getCategories,
	getCategory,
};
