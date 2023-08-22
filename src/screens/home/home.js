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
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";
import ImageComponent from "../../components/imageComponent/imageComponent";
import SideSwipe from "react-native-sideswipe";
import { Video } from "expo-av";
import * as NavigationBar from "expo-navigation-bar";
import GestureGalery from "../../components/gestureComponents/gesturesGalery";

var pageValue = 42;
var limitHttp = 42;
var sumPages = 42;
var useNextPage = true;
export default function GaleryScreen({ navigation }) {
  const [galeryImages, setgaleryImages] = React.useState([]);
  const [hightResolutionImages, sethightResolutionImages] =
    React.useState(false);
  const animationGestureRef = React.useRef();
  const scrollRef = React.useRef();
  const tagsData = useSelector((state) => state.galeryImages);
  const [currentPage, setcurrentPage] = React.useState(0);
  const config = {
    velocityThreshold: 1,
    directionalOffsetThreshold: 50,
  };
  function getImages() {
    if (tagsData.imageTags) {
      getImagesGalery(`${tagsData.imageTags}+`, 0, limitHttp)
        .then((response) => {
          setgaleryImages(response.data.data);
        })
        .catch((err) => console.log(err));
    } else {
      getImagesGalery(``, null, limitHttp)
        .then((response) => {
          setgaleryImages(response.data.data);
        })
        .catch((err) => console.log(err));
    }
    NavigationBar.setVisibilityAsync("hidden");
  }
  async function changeImageResolution() {
    sethightResolutionImages(!hightResolutionImages);
    setgaleryImages([]);

    if (hightResolutionImages == false) {
      pageValue = 1;
      limitHttp = 15;
      sumPages = 1;
    } else {
      pageValue = 1;
      limitHttp = 42;
      sumPages = 1;
    }

    getImagesGalery(`${tagsData.imageTags}+`, 0, limitHttp).then((response) => {
      setgaleryImages(response.data.data);
    });
  }
  function nextPage() {
    pageValue++;

    getImagesGalery(`${tagsData.imageTags}+`, pageValue, limitHttp).then(
      (response) => {
        setgaleryImages(response.data.data);
        setcurrentPage(pageValue);
        scrollRef.current?.scrollToOffset({
          offset: 0,
          animated: false,
        });
      }
    );
  }
  function previousPage() {
    if (pageValue !== 0) {
      pageValue--;
      getImagesGalery(`${tagsData.imageTags}+`, pageValue, limitHttp).then(
        (response) => {
          setgaleryImages(response.data.data);
          setcurrentPage(pageValue);
          scrollRef.current?.scrollToOffset({
            offset: 0,
            animated: false,
          });
        }
      );
    }
  }

  function showimageFileComponent(fileURL, type, postInfo) {
    navigation.navigate("ShowFile", {
      fileURL: fileURL,
      type: type,
      postInfo: postInfo,
    });
  }

  React.useEffect(() => {
    pageValue = 0;
    limitHttp = 42;
    sumPages = 1;
    getImages();
    NavigationBar.setVisibilityAsync("hidden");
  }, []);

  if (galeryImages[0]) {
    return (
      <>
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
            }}
          >
            <SafeAreaView
              style={{
                position: "relative",
                flex: 1,
                width: Dimensions.get("window").width,
                alignItems: "center",
                paddingBottom: 20,
                paddingTop: 20,
              }}
            >
              <GestureRecognizer
                onSwipeLeft={() => animationGestureRef.current("right")}
                onSwipeRight={previousPage}
                config={config}
                style={{
                  flex: 1,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    borderRadius: 20,
                    height: 200,
                  }}
                >
                  <GestureGalery
                    animationGestureRef={animationGestureRef}
                    changePageNext={() => nextPage()}
                  ></GestureGalery>

                  <FlatList
                    numColumns={hightResolutionImages == true ? 1 : 2}
                    style={{
                      flex: 1,
                      borderRadius: 30,
                      width: Dimensions.get("window").width - 30,
                    }}
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
                              item.item.media_type == "video"
                                ? "video"
                                : "image",
                              item.item
                            )
                          }
                        >
                          {hightResolutionImages == true ? (
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
                          ) : (
                            <View style={style.contentImageStyleMini}>
                              <Image
                                source={{
                                  uri:
                                    hightResolutionImages == true
                                      ? item.item.low_res_file.url
                                      : item.item.preview_file.url,
                                }}
                                style={{
                                  borderRadius: 10,
                                  width:
                                    Dimensions.get("window").width / 2 - 25,
                                  height:
                                    Dimensions.get("window").width / 2 - 25,
                                }}
                              ></Image>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    }}
                    keyExtractor={(item, index) =>
                      `${new Date().getDate()}${index}`
                    }
                    ListFooterComponent={() => (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: 20,
                          marginBottom: 10,
                          width: Dimensions.get("window").width,
                        }}
                      >
                        {currentPage == 0 ? (
                          <TouchableOpacity
                            style={[style.buttonStyle, { opacity: 0.1 }]}
                            onPress={previousPage}
                          >
                            <Image
                              style={{
                                width: 12,
                                height: 12,
                                marginRight: 15,
                                opacity: 0,
                              }}
                              source={require("./../../../assets/imgs/icons/navigateArrows(2).png")}
                            ></Image>
                            <Text
                              style={[style.buttonTextStyle, { opacity: 0 }]}
                            >
                              {`Page 2`}
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={[style.buttonStyle]}
                            onPress={previousPage}
                          >
                            <Image
                              style={{ width: 12, height: 12, marginRight: 15 }}
                              source={require("./../../../assets/imgs/icons/navigateArrows(2).png")}
                            ></Image>
                            <Text style={style.buttonTextStyle}>
                              {currentPage > 0 ? `Page ${currentPage}` : ""}
                            </Text>
                          </TouchableOpacity>
                        )}

                        <TouchableOpacity
                          style={style.buttonStyle}
                          onPress={() => animationGestureRef.current("right")}
                        >
                          <Text style={style.buttonTextStyle}>
                            {`Page ${currentPage + 2}`}
                          </Text>
                          <Image
                            style={{ width: 12, height: 12, marginLeft: 15 }}
                            source={require("./../../../assets/imgs/icons/navigateArrows(1).png")}
                          ></Image>
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
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderRadius: 0,
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
    backgroundColor: "black",
    padding: 10,
    marginRight: 25,
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonTextStyle: {
    textAlign: "center",
    color: "white",
    fontSize: 15,
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
  contentImageStyleMini: {
    marginVertical: 2,
    padding: 6,
  },
  contentImageStyleVideoMini: {
    marginVertical: 5,
    backgroundColor: "black",
    borderRadius: 10,
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
