import { View, Text, StyleSheet, Image } from "react-native";
import { Video } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { useRoute } from "@react-navigation/native";
import GestureRecognizer, { swipeDirections } from "react-native-swipe-gestures";
export default function ShowFileImage({ fileURL, type, navigation }) {
	const [videoStatus, setvideoStatus] = useState({});
	const video = useRef(null);
	const route = useRoute();
	const [showVideo, setshowVideo] = useState(false);
	const config = {
		velocityThreshold: 0.3,
		directionalOffsetThreshold: 80,
	};

	useEffect(() => {
		if (route.params.type == "video") {
			setshowVideo(true);
		} else {
			setshowVideo(false);
		}
	}, []);

	function backSwipe() {
		navigation.navigate("Galery");
		console.log(true);
	}

	return (
		<GestureRecognizer
			onSwipeRight={backSwipe}
			config={config}
			style={{
				flex: 1,
			}}
		>
			<View style={style.container}>
				<View style={style.subContainer}>
					{showVideo ? (
						<Video
							source={{ uri: route.params.fileURL }}
							ref={video}
							style={{ width: "100%", height: "100%" }}
							onPlaybackStatusUpdate={setvideoStatus}
							useNativeControls
							resizeMode="contain"
							shouldPlay
							isLooping={true}
						></Video>
					) : (
						<Image
							style={{ width: "100%", height: "100%", resizeMode: "contain" }}
							source={{ uri: route.params.fileURL }}
						/>
					)}
				</View>
			</View>
		</GestureRecognizer>
	);
}

{
	/*  */
}

const style = StyleSheet.create({
	subContainer: {
		backgroundColor: "white",
		width: "100%",
		height: "100%",
	},
	container: {
		flex: 1,
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		width: "100%",
		height: "100%",
		backgroundColor: "black",
		zIndex: 3,
		justifyContent: "center",
		alignContent: "center",
		alignItems: "center",
	},
});
