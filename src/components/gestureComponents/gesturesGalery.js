import { View, Dimensions, Image, Animated, Easing } from "react-native";
import { useEffect, useRef, useState } from "react";

var useGesturer = true;
export default function GestureGalery({ animationGestureRef, changePageNext }) {
	const { height, width } = Dimensions.get("window");
	const [showAnimation, setshowAnimation] = useState(false);
	const marginLeftAnimation = useRef(new Animated.Value(width)).current;
	const showArrowAnimation = useRef(new Animated.Value(0)).current;
	const marginLeftArrowAnimation = useRef(new Animated.Value(-100)).current;

	function showAnimationGesture(type) {
		if (useGesturer) {
			useGesturer = false;
			setshowAnimation(true);
			setTimeout(() => {
				Animated.timing(marginLeftAnimation, {
					toValue: -width,
					duration: 200,
					useNativeDriver: false,
					easing: Easing.in,
				}).start();

				setTimeout(() => {
					changePageNext();

					Animated.timing(showArrowAnimation, {
						toValue: 1,
						duration: 200,
						useNativeDriver: false,
						easing: Easing.in(),
					}).start();
					Animated.timing(marginLeftArrowAnimation, {
						toValue: 30,
						duration: 200,
						useNativeDriver: false,
						easing: Easing.in(),
					}).start();
					setTimeout(() => {
						Animated.timing(showArrowAnimation, {
							toValue: 0,
							duration: 700,
							useNativeDriver: false,
							easing: Easing.in(),
						}).start();
						setTimeout(() => {
							Animated.timing(marginLeftAnimation, {
								toValue: width,
								duration: 300,
								useNativeDriver: false,
								easing: Easing.in(),
							}).start();

							setTimeout(() => {
								setshowAnimation(false);
								Animated.timing(marginLeftArrowAnimation, {
									toValue: -100,
									duration: 0,
									useNativeDriver: false,
									easing: Easing.in(),
								}).start();
								setTimeout(() => {
									useGesturer = true;
								}, 3000);
							}, 1000);
						}, 300);
					}, 1000);
				}, 400);
			}, 100);
		}
	}
	useEffect(() => {
		animationGestureRef.current = showAnimationGesture;
	}, []);
	if (showAnimation) {
		return (
			<Animated.View
				style={{
					position: "absolute",
					backgroundColor: "black",
					width: width,
					height: "100%",
					left: "100%",
					marginLeft: marginLeftAnimation,
					top: 0,
					bottom: 0,
					zIndex: 10,
					borderRadius: 30,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Animated.View
					style={{ opacity: showArrowAnimation, marginLeft: marginLeftArrowAnimation }}
				>
					<Image
						style={{
							width: 80,
							height: 80,
						}}
						source={require("./../../../assets/imgs/icons/gestureIcon1.png")}
					></Image>
				</Animated.View>
			</Animated.View>
		);
	}
}
