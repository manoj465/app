import React, { useRef } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import Animated, { multiply } from "react-native-reanimated";
import { interpolateColor, onScrollEvent, useValue } from "react-native-redash";
import { useDispatch, useSelector } from "react-redux";
import { WelcomeFooterSlide } from "./WelcomeFooterSlide";
import { SLIDE_HEIGHT, WelcomeSlide } from "./WelcomeSlide";
import api from "../../../services/api"
import Axios from "axios";
import { reduxStore } from "../../../redux";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { MainRouterStackParamList } from "../../../routers/MainRouter"
import { _appState } from "../../../redux/rootReducer";

const { width, height } = Dimensions.get("window");
const BORDER_RADIUS = 75;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "white",
  },
  slideContainer: {
    flex: 0.6,
    backgroundColor: "cyan",
    borderBottomRightRadius: BORDER_RADIUS,
  },
  footer: { flex: 0.4 },
  footerContent: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    borderTopLeftRadius: BORDER_RADIUS,
  },
});

const slides = [
  {
    label: "Relaxed",
    color: "#BFEAF5",
    footerContent: {
      title: "Relaxed",
      description:
        "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
    },
  },
  {
    label: "Playful",
    color: "#BEECC4",
    footerContent: {
      title: "Playful",
      description:
        "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
    },
  },
  {
    label: "Excentric",
    color: "#FFE4D9",
    footerContent: {
      title: "Excentric",
      description:
        "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
    },
  },
  {
    label: "Funky",
    color: "#FFDDDD",
    footerContent: {
      title: "Funky",
      description:
        "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
    },
  },
];

type navigationProp_t = StackNavigationProp<MainRouterStackParamList, "onboarding">;
type routeProp_t = RouteProp<MainRouterStackParamList, "onboarding">;

interface props_t {
  navigation: navigationProp_t;
  route: routeProp_t;
}

export const WelcomeScreen = ({ navigation }: props_t) => {
  const dispatch = useDispatch();
  const appCTX = useSelector<_appState>(({ appCTXReducer: { appCTX } }) => appCTX);
  const scroll = useRef(null);
  const x = useValue(0);
  const onScroll = onScrollEvent({ x });
  const backgroundColor: any = interpolateColor(x, {
    inputRange: slides.map((_, i) => i * width),
    outputRange: slides.map((slide) => slide.color),
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.slideContainer, { backgroundColor }]}>
        <Animated.ScrollView
          ref={scroll}
          horizontal
          snapToInterval={width}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          bounces={false}
          scrollEventThrottle={1}
          {...{ onScroll }}
        >
          {slides.map(({ label }, index) => (
            <WelcomeSlide key={index} right={!!(index % 2)} {...{ label }} />
          ))}
        </Animated.ScrollView>
      </Animated.View>
      <View style={styles.footer}>
        <Animated.View
          style={{ ...StyleSheet.absoluteFillObject, backgroundColor }}
        />
        <Animated.View
          style={[
            styles.footerContent,
            {
              width: width * slides.length,
              transform: [{ translateX: multiply(x, -1) }],
            },
          ]}
        >
          {slides.map(({ footerContent }, index) => (
            <WelcomeFooterSlide
              key={index}
              onPress={async () => {
                if (Platform.OS == "web") {
                  navigation.replace("user");
                } else
                  if (scroll?.current && slides.length - 1 != index) {
                    try {
                      //@ts-ignore
                      scroll.current.getNode().scrollTo({ x: width * (index + 1), animated: true });
                      console.log("index is = " + index)
                    } catch (error) { }
                  } else if (slides.length - 1 == index) {
                    navigation.replace("user");
                  }
              }}
              /*  onPress={() => {
                 reduxStore.store.dispatch(reduxStore.actions.appCTX.userRedux({ user: { userName: "test_user 2", email: "testmail@gmail.com", ts: 0 }, log: (s) => { console.log("[REDUX TEST]" + s) } }))
               }} */
              last={index === slides.length - 1}
              {...{ footerContent }}
            />
          ))}
        </Animated.View>
      </View>
    </View>
  );
};
