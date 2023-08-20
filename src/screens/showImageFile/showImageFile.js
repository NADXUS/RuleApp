import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { Video } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { useRoute } from "@react-navigation/native";
import * as Linking from "expo-linking";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";
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
    console.log(route.params.postInfo.tags.artist.join(" / "));
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

  function openWebSource(url) {
    Linking.openURL(url);
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
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  right: 0,
                  zIndex: 5,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                  padding: 20,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <View>
                    <Text
                      style={{
                        color: "black",
                        backgroundColor: "white",
                        padding: 10,
                        paddingHorizontal: 20,
                        borderRadius: 10,
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}> Artist: </Text>
                      <Text>{route.params.postInfo.tags.artist[0]}</Text>
                    </Text>
                  </View>
                  <View
                    style={{
                      color: "black",
                      backgroundColor: "white",
                      padding: 7,
                      borderRadius: 10,
                      marginLeft: 10,
                    }}
                  >
                    <Image
                      style={{ width: 25, height: 25 }}
                      source={require("../../../assets/imgs/icons/share1.png")}
                    ></Image>
                  </View>
                </View>
              </View>
              <Image
                style={style.backgroundImage}
                blurRadius={15}
                source={{ uri: route.params.fileURL }}
              />
              <Image
                style={{
                  width: Dimensions.get("window").width,
                  height: Dimensions.get("window").height,
                  resizeMode: "contain",
                }}
                source={{ uri: route.params.fileURL }}
              />
            </View>
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
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height + 100,
    resizeMode: "cover",
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },
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
