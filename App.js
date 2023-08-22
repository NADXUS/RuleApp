import { store } from "./src/state/store";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Index from "./src/screens/index";
import { Provider } from "react-redux";
import GaleryScreen from "./src/screens/home/home";
import ShowFileImage from "./src/screens/showImageFile/showImageFile";
import CarrouselScreen from "./src/screens/carrousel/carrousel";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";

const Stack = createNativeStackNavigator();
export default function App() {

	useEffect(() => {
		NavigationBar.setBackgroundColorAsync('white');

	}, []);

	return (
		<Provider store={store}>
			<StatusBar hidden />

			<NavigationContainer>
				<Stack.Navigator
					screenOptions={{
						headerShown: false,
					}}
				>
					<Stack.Screen name="Home" component={Index} />
					<Stack.Screen name="Galery" component={GaleryScreen} />
					<Stack.Screen name="Carrousel" component={CarrouselScreen} />

					<Stack.Screen name="ShowFile" component={ShowFileImage} />
				</Stack.Navigator>
			</NavigationContainer>
		</Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
