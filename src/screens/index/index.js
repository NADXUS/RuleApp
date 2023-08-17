import {
	Button,
	StyleSheet,
	Text,
	TextInput,
	View,
	ScrollView,
	TouchableOpacity,
	FlatList,
	Image,
} from "react-native";
import React from "react";
import { useDispatch } from "react-redux";
import { addImagesTags } from "../../state/reducers";
import { getTagsSearch } from "./../../Plugins/Axios/AxiosHttp";
import { Keyboard } from 'react-native';

export default function Index({ navigation }) {
	const [textTags, onChangeTextTags] = React.useState("");
	const [tags, settags] = React.useState([]);
	const [selectedTags, setselectedTags] = React.useState([]);
	const reduxDispatch = useDispatch();
	const [content1Flex, setcontent1Flex] = React.useState(1);
	function navigate() {
		let valueFormated = selectedTags.join("+");
		reduxDispatch(addImagesTags({ imageTags: valueFormated + "+" }));
		setselectedTags([]);
		settags([]);
		navigation.navigate("Galery");
	}
	function changeText(value) {
		getTagsSearch(value).then((response) => {
			settags(response.data);
		});
		let valueFormated = value.replace(/\s/g, "_");
		onChangeTextTags(valueFormated);
		if (valueFormated == "") {
			setselectedTags([]);
		}
	}
	function selectedTagsFunction(tagsValue) {
		setselectedTags([...selectedTags, tagsValue]);
		onChangeTextTags("");
	}

	React.useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			'keyboardDidShow',
			() => {
				setcontent1Flex(0.4);
			},
		);

		const keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => {
				setcontent1Flex(1);
			},
		);

		return () => {
			keyboardDidHideListener.remove();
			keyboardDidShowListener.remove();
		};
	}, []);

	return (
		<>
			<View style={style.contentAll}>
				<View style={[style.contentAll.content1, { flex: content1Flex }]}>
					<View style={style.imageContent}>
						<Image
							source={require("./../../../assets/imgs/image1.png")}
							style={style.imageContent.Image}
						></Image>
					</View>
				</View>
				<View style={style.contentAll.content2}>
					<View>
						<Text style={{ fontSize: 30, fontWeight: "bold" }}>RuleApp</Text>
						<View style={{ marginVertical: 10 }}></View>
						{selectedTags[0] ? <>
							<View style={style.contentTagsSelected}>
								<FlatList
									style={{ paddingBottom: 10 }}
									horizontal
									data={selectedTags}
									renderItem={(tag) => {
										return (
											<View style={style.btnTags}>
												<Text style={style.textTagsSelected}>{tag.item}</Text>
											</View>
										);
									}}
									keyExtractor={(item, index) =>
										`tagNameSelected${new Date().getTime()}${index}`
									}
								/>
							</View>
						</> : <>
							<View style={style.contentTagsSelected}>
								<View style={style.btnTagsDisabled}>
									<Text style={style.textTagsSelectedDisabled}></Text>
								</View>
								<View style={style.btnTagsDisabled}>
									<Text style={style.textTagsSelectedDisabled}></Text>
								</View>
							</View>
						</>
						}
						<View style={style.containerSearch}>
							<TextInput
								placeholder="Search Tags..."
								style={style.searchInput}
								onChangeText={changeText}
								value={textTags}
								autoCapitalize="none"
							/>
						</View>
						<View style={{ marginVertical: 20 }}></View>
						{tags.length > 0 ?
							<>
								<View style={style.contentTags}>
									<FlatList
										keyboardShouldPersistTaps='handled'
										style={{ paddingBottom: 10 }}
										horizontal
										data={tags}
										renderItem={(tag, index) => {
											return (
												<TouchableOpacity
													style={style.contentBtnTags}
													onPress={() => selectedTagsFunction(tag.item.value)}
												>
													<Text
														key={`tag${new Date().getTime()}${index}`}
														style={style.textTags}
													>
														{tag.item.value}
													</Text>
													<Image style={{ width: 12, height: 12, marginLeft: 5 }} source={require("./../../../assets/imgs/icons/Arrow1.png")}></Image>
												</TouchableOpacity>
											);
										}}
										keyExtractor={(item, index) => `tagName${new Date().getTime()}${index}`}
									/>

								</View>
								<View style={{ marginVertical: 5 }}></View>
							</> : <>
								<View style={style.contentTags}>
									<View style={style.btnTagsDisabled}>
										<Text style={style.textTagsSelectedDisabled}></Text>
									</View>
									<View style={style.btnTagsDisabled}>
										<Text style={style.textTagsSelectedDisabled}></Text>
									</View>
									<View style={style.btnTagsDisabled}>
										<Text style={style.textTagsSelectedDisabled}></Text>
									</View>
								</View>
								<View style={{ marginVertical: 5 }}></View>
							</>
						}

						<TouchableOpacity style={style.buttonSearch} onPress={() => navigate()}>
							<Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>Continue</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			{/* 
			
			
			<View style={{ marginTop: 10 }}></View>
			
			<View style={{ marginTop: 10 }}></View>
			
		</View> */}
		</>
	);
}

const style = StyleSheet.create({
	contentBtnTags:
	{
		backgroundColor: "white",
		marginRight: 5,
		justifyContent: "center",
		alignItems: "center",
		padding: 5,
		paddingHorizontal: 10,
		borderRadius: 30,
		flexDirection: "row",
		borderWidth: 2,
	}
	,
	imageContent: {
		padding: 30,
		paddingBottom: 0,

		Image: {
			width: "100%",
			height: "100%",
			borderRadius: 40,
			resizeMode: "cover",
		},
	},
	contentAll: {
		flex: 1,
		backgroundColor: "white",

		content1: {
			paddingTop: 30,
			backgroundColor: "white",
		},
		content2: {
			flex: 0.7,
			backgroundColor: "white",
			padding: 35,
			paddingTop: 20
		},
	},
	btnTags: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "black",
		borderRadius: 30,
		marginRight: 5,
		paddingHorizontal: 10,
	},
	btnTagsDisabled: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "black",
		borderRadius: 30,
		marginRight: 5,
		paddingHorizontal: 10,
		minWidth: 100,
		height: 30,
		opacity: 0.07,
	},
	textTagsSelectedDisabled: {
		padding: 5,
		color: "white",
		fontWeight: "bold",
	},
	contentTagsSelected: {
		marginBottom: 20,
		width: "100%",
		height: 50,
		justifyContent: "flex-start",
		alignItems: "flex-start",
		flexDirection: "row",
	},
	containerSearch: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	searchInput: {
		width: "100%",
		height: 40,
		padding: 10,
		fontSize: 15,
		backgroundColor: "#fff",
		borderWidth: 2,
		borderRadius: 30,
		paddingHorizontal: 20,
	},
	buttonSearch: {
		minWidth: "100%",
		height: 50,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "black",
		borderWidth: 1,
		alignSelf: "stretch",
		borderRadius: 30
	},
	textTagsSelected: {
		padding: 5,
		color: "white",
		fontWeight: "bold",
	},
	textTags: {
		textAlign: "center",
		fontWeight: "bold",
	},
	contentTags: {
		width: "100%",
		height: 40,
		flexDirection: "row",
	},
});
