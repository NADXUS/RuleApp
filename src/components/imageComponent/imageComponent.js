import AutoHeightImage from "react-native-auto-height-image";
import { Dimensions, Text, View, Image } from "react-native";
import { useState, useEffect } from "react";
export default function ImageComponent({
	item,
	hightResolutionImages,
	index,
	activateLoading,
}) {
	const [loaded, setloaded] = useState(activateLoading);

	return (
		<>
			<View>
				<View style={{ position: "relative" }}>
					<AutoHeightImage
						style={{
							opacity: loaded ? 1 : 0,
							borderRadius: 30,
						}}
						key={`${new Date().getDate()}${index}`}
						width={Dimensions.get("window").width - 40}
						source={{
							uri:
								hightResolutionImages == false
									? item.item.preview_file.url
									: item.item.low_res_file.url,
						}}
						onLoad={() => {
							setloaded(true);
						}}
					/>
				</View>
				{!loaded && (
					<View
						style={{
							position: "absolute",
							width: "100%",
							height: "100%",
							minHeight: 100,
							zIndex: 10,
							justifyContent: "center",
							alignItems: "center",
							marginVertical: 50,
						}}
					>
						<Image
							style={{ width: 50, height: 50 }}
							source={require("./../../../assets/imgs/icons/loading1.gif")}
						></Image>
					</View>
				)}
			</View>
		</>
	);
}
