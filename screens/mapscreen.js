import React, { useEffect, useState, useRef } from "react";
import Constants from "expo-constants";
import * as Location from "expo-location";
import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import html_script from "../html_script/html_script_mapscreen";
import dlm from "../html_script/dulieumau.json";
import {
  Spinner,
  HStack,
  Heading,
  Center,
  NativeBaseProvider,
  Text,
} from "native-base";
import {
  _showLocationGPS,
  _showGEOJSONFILE,
  _showMapScreen,
} from "../Utils/Common";

const MapScreen = ({ route, navigation }) => {
  const [msg, setMsg] = useState("");
  const Map_Ref = useRef();
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    if (route.params?.post) {
      setIsLoading(route.params?.post);
    }
  }, [route.params?.post]);

  useEffect(() => {
    (async () => {
      if (Platform.OS === "android" && !Constants.isDevice) {
        setMsg(
          "Oops, this will not work on Snack in an Android emulator. Try it on your device!"
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setMsg("Permission to access location was denied");
        return;
      }
      let getloca = await Location.getCurrentPositionAsync({});
      setMsg(`[${getloca.coords.latitude}, ${getloca.coords.longitude}]`);
      _showLocationGPS(getloca, Map_Ref);
      _showMapScreen(Map_Ref);
      // _showGEOJSONFILE(dlm, Map_Ref);
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      _showMapScreen(Map_Ref);
    });
    return unsubscribe;
  }, [navigation]);

  //Return giao diện cho Mapscreen
  let mapscreen;
  if (isLoading) {
    mapscreen = (
      <NativeBaseProvider>
        <Center flex={1} px="3">
          <HStack space={2} justifyContent="center">
            <Spinner accessibilityLabel="Loading posts" />
            <Heading color="primary.500" fontSize="md">
              Loading
            </Heading>
          </HStack>
        </Center>
      </NativeBaseProvider>
    );
  } else {
    mapscreen = (
      <>
        <NativeBaseProvider>
          <SafeAreaView style={styles.Container}>
            <WebView
              ref={Map_Ref}
              source={{ html: html_script }}
              style={styles.Webview}
            />
            <View style={styles.Text}>
              <Text>Bạn đang ở tọa độ: {msg}</Text>
            </View>
          </SafeAreaView>
        </NativeBaseProvider>
      </>
    );
  }
  return <>{mapscreen}</>;
};

export default MapScreen;
const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  WebView: {
    flex: 2,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
});
