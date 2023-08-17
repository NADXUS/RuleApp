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
import * as NavigationBar from "expo-navigation-bar";

var pageValue = 42;
var limitHttp = 42;
var sumPages = 42;
var useNextPage = true;
export default function GaleryScreen({ navigation }) {
	const [galeryImages, setgaleryImages] = React.useState([]);
	const [hightResolutionImages, sethightResolutionImages] = React.useState(false);

	const scrollRef = React.useRef();
	const tagsData = useSelector((state) => state.galeryImages);

	const config = {
		velocityThreshold: 0.5,
		directionalOffsetThreshold: 10,
	};
	function getImages() {
		if (tagsData.imageTags) {
			getImagesGalery(`${tagsData.imageTags}+`, 0, limitHttp).then((response) => {
				setgaleryImages(response.data.data);
			});
		} else {
			getImagesGalery(``, null, limitHttp).then((response) => {
				setgaleryImages(response.data.data);
			});
		}
	}
	async function changeImageResolution() {
		sethightResolutionImages(!hightResolutionImages);
		setgaleryImages([]);
		pageValue = 1;
		limitHttp = 15;

		sumPages = 1;
		getImagesGalery(`${tagsData.imageTags}+`, 0, limitHttp).then((response) => {
			setgaleryImages(response.data.data);
		});
	}
	function nextPage() {
		pageValue++;

		getImagesGalery(`${tagsData.imageTags}+`, pageValue, limitHttp).then((response) => {
			setgaleryImages(response.data.data);
			scrollRef.current?.scrollToOffset({
				offset: 0,
				animated: false,
			});
		});
	}
	function previousPage() {
		if (pageValue !== 1) {
			pageValue = pageValue - sumPages;
			getImagesGalery(`${tagsData.imageTags}+`, pageValue, limitHttp).then((response) => {
				setgaleryImages(response.data);
				scrollRef.current?.scrollToOffset({
					offset: 0,
					animated: false,
				});
			});
		}
	}

	function showimageFileComponent(fileURL, type) {
		navigation.navigate("ShowFile", {
			fileURL: fileURL,
			type: type,
		});
	}

	React.useEffect(() => {
		pageValue = 1;
		limitHttp = 40;
		sumPages = 1;
		getImages();
		NavigationBar.setVisibilityAsync("hidden");
	}, []);

	if (galeryImages[0]) {
		return (
			<>
				<View style={{ flex: 1, backgroundColor: "black" }}>
					<View
						style={{
							flex: 1,
							backgroundColor: "white",
							borderRadius: 30,
							borderTopLeftRadius: 0,
							borderTopRightRadius: 0,
						}}
					>
						<SafeAreaView
							style={{
								position: "relative",
								flex: 1,
								width: Dimensions.get("window").width,
								alignItems: "center",
								paddingBottom: 20,
								paddingTop: 50,
							}}
						>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									paddingHorizontal: 20,
									width: Dimensions.get("window").width,
									paddingBottom: 20,
								}}
							>
								<View style={{ flexDirection: "row" }}>
									<View style={{ justifyContent: "center", marginRight: 10 }}>
										<Image
											style={{ width: 50, height: 50, opacity: 0.4 }}
											source={require("./../../../assets/imgs/icons/headerIcon2.png")}
										></Image>
									</View>
									<View>
										<Text style={{ fontSize: 25, fontWeight: "bold" }}>One_Piece</Text>
										<Text style={{ opacity: 0.3 }}>animated, one_piece, Gang_bang</Text>
									</View>
								</View>
								<View style={{ justifyContent: "center" }}>
									<Image
										style={{ width: 30, height: 30, opacity: 0.3 }}
										source={require("./../../../assets/imgs/icons/headerIcon1.png")}
									></Image>
								</View>
							</View>
							<GestureRecognizer
								onSwipeLeft={nextPage}
								onSwipeRight={previousPage}
								config={config}
								style={{
									flex: 1,
								}}
							>
								<View
									style={{ flex: 1, overflow: "hidden", borderRadius: 40, height: 200 }}
								>
									<FlatList
										style={{ flex: 1, borderRadius: 30 }}
										ref={scrollRef}
										data={galeryImages}
										renderItem={(item, index) => {
											return (
												<TouchableOpacity
													onPress={() =>
														showimageFileComponent(
															item.item.media_type == "video"
																? item.item.high_res_file.url
																: item.item.low_res_file.url,
															item.item.media_type == "video" ? "video" : "image"
														)
													}
												>
													<View
														style={
															item.item.media_type == "video"
																? style.contentImageStyleVideo
																: style.contentImageStyle
														}
													>
														<ImageComponent
															item={item}
															hightResolutionImages={hightResolutionImages}
															index={index}
															activateLoading={false}
														></ImageComponent>
													</View>
												</TouchableOpacity>
											);
										}}
										keyExtractor={(item, index) => `${new Date().getDate()}${index}`}
										ListFooterComponent={() => (
											<View>
												<TouchableOpacity style={style.buttonStyle} onPress={nextPage}>
													<Text style={style.buttonTextStyle}>Siguiente pagina</Text>
												</TouchableOpacity>
												<TouchableOpacity
													style={style.buttonStyle}
													onPress={previousPage}
												>
													<Text style={style.buttonTextStyle}>Anterior pagina</Text>
												</TouchableOpacity>
											</View>
										)}
									/>
								</View>
							</GestureRecognizer>
						</SafeAreaView>
					</View>
					<View
						style={{
							flex: 0.1,
							backgroundColor: "black",
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							paddingHorizontal: 50,
						}}
					>
						<TouchableOpacity
							style={style.menuContainer}
							onPress={() => navigation.navigate("Home")}
						>
							<Image
								style={style.menuIcons}
								source={require("./../../../assets/imgs/icons/menuIcons1.png")}
							></Image>
						</TouchableOpacity>
						<TouchableOpacity
							style={style.menuContainer}
							onPress={() => navigation.navigate("Carrousel")}
						>
							<Image
								style={style.menuIcons}
								source={require("./../../../assets/imgs/icons/menuIcons2.png")}
							></Image>
						</TouchableOpacity>
						<TouchableOpacity
							style={style.menuContainer}
							onPress={() => changeImageResolution()}
						>
							{hightResolutionImages == false ? (
								<Image
									style={style.menuIcons}
									source={require("./../../../assets/imgs/icons/menuIcons3.png")}
								></Image>
							) : (
								<Image
									style={style.menuIcons}
									source={require("./../../../assets/imgs/icons/menuIcons4.png")}
								></Image>
							)}
						</TouchableOpacity>
					</View>
				</View>
				{/* 	<GestureRecognizer
					onSwipeLeft={nextPage}
					onSwipeRight={previousPage}
					config={config}
					style={{
						flex: 1,
					}}
				>
					<View style={style.contentAll}>
						<View style={style.listStyle}>
							
						</View>
					</View>
				</GestureRecognizer> */}
			</>
		);
	}
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
		padding: 2,
	},
	contentImageStyleVideo: {
		marginVertical: 5,
		backgroundColor: "black",
		padding: 5,
		borderRadius: 35,
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
	menuContainer: {
		marginHorizontal: 30,
	},
	menuIcons: {
		width: 35,
		height: 35,
	},
};
