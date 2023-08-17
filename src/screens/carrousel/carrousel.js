import * as React from "react";
import { getImagesGalery } from "./../../Plugins/Axios/AxiosHttp";
import {
	View,
	Text,
	SafeAreaView,
	TouchableOpacity,
	Dimensions,
	FlatList,
	Image,
} from "react-native";
import { useSelector } from "react-redux";
import GestureRecognizer, { swipeDirections } from "react-native-swipe-gestures";
import ImageComponent from "../../components/imageComponent/imageComponent";
import SideSwipe from "react-native-sideswipe";
import { Video } from "expo-av";

var pageValue = 15;
var limitHttp = 15;
var sumPages = 15;
var useNextPage = true;

/* ========================================================= */
/* ========================================================= */
/* ========================================================= */
/* ========================================================= */
export default function CarrouselScreen({ navigation }) {
	const [newGaleryImages, setnewGaleryImages] = React.useState([]);
	const [actualContent, setactualContent] = React.useState(0);
	const scrollRef = React.useRef();
	const tagsData = useSelector((state) => state.galeryImages);
	const video = React.useRef(null);
	const [videoStatus, setvideoStatus] = React.useState({});

	const config = {
		velocityThreshold: 0.3,
		directionalOffsetThreshold: 90,
	};
	function getImages() {
		if (tagsData.imageTags) {
			getImagesGalery(`${tagsData.imageTags}+`, 0, limitHttp).then((response) => {
				setnewGaleryImages(response.data.data);
			});
		} else {
			getImagesGalery(``, null, limitHttp).then((response) => {
				setnewGaleryImages(response.data.data);
			});
		}

		/* 	if (tagsData.imageTags) {
			getImagesGalery(`${tagsData.imageTags}+`, null, limitHttp).then((response) => {
				if (response.data) {
					setnewGaleryImages(response.data.data);
					console.log(newGaleryImages[actualContent]);
				}
			});
		} else {
			getImagesGalery(``, null, limitHttp).then((response) => {
				setnewGaleryImages(response.data);
				console.log(newGaleryImages[actualContent]);
			});
		} */
	}
	function nextPage() {
		pageValue = pageValue + sumPages;
		getImagesGalery(`${tagsData.imageTags}+`, pageValue, limitHttp).then((response) => {
			scrollRef.current?.scrollToOffset({
				offset: 0,
				animated: false,
			});
			setnewGaleryImages([...response.data.data, { nextPage: true }]);
			useNextPage = true;
		});
	}

	function nextImage() {
		if (newGaleryImages[actualContent + 2]) {
			setactualContent(actualContent + 1);
		} else {
			nextPage();
			setactualContent(0);
		}
	}
	function previousImage() {
		if (actualContent !== 0) {
			setactualContent(actualContent - 1);
		}
	}

	React.useEffect(() => {
		pageValue = 1;
		limitHttp = 15;
		sumPages = 1;
		getImages();
	}, []);

	return (
		<GestureRecognizer
			onSwipeLeft={nextImage}
			onSwipeRight={previousImage}
			config={config}
			style={{
				flex: 1,
			}}
		>
			{newGaleryImages.map((item, index) => {
				if (actualContent === index) {
					if (item.media_type == "video") {
						return (
							<Video
								key={`video${new Date().getDate()}${index}`}
								source={{ uri: item.high_res_file.url }}
								ref={video}
								style={{
									width: Dimensions.get("window").width,
									height: Dimensions.get("window").height,
								}}
								onPlaybackStatusUpdate={setvideoStatus}
								useNativeControls
								resizeMode="contain"
								shouldPlay
								isLooping={true}
							></Video>
						);
					} else {
						return (
							<Image
								key={`${new Date().getDate()}${index}`}
								source={{ uri: item.low_res_file.url }}
								style={{
									width: Dimensions.get("window").width,
									height: Dimensions.get("window").height,
									resizeMode: "contain",
								}}
							/>
						);
					}
				}
			})}
		</GestureRecognizer>
	);
}

const style = {
	contetnBtn: {
		alignContent: "stretch",
		marginTop: 50,
	},
	buttonStyle: {
		backgroundColor: "white",
		padding: 10,
		marginRight: 10,
		width: "100%",
		marginVertical: 5,
	},
	buttonTextStyle: {
		textAlign: "center",
	},
	contentImageStyle: {
		marginVertical: 5,
		padding: 5,
	},
	contentImageStyleVideo: {
		marginVertical: 5,
		backgroundColor: "blue",
		padding: 5,
	},
	listStyle: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-around",
	},
	contentAll: {
		flex: 1,
		padding: 10,
	},
};
