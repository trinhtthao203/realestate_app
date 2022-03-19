import React, { useEffect, useState, useRef } from "react";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import html_script from "../html_script/html_script_mapscreen";
import dlm from "../html_script/dulieumau.json";
import {
  Spinner,
  HStack,
  Heading,
  Center,
  NativeBaseProvider,
  Button,
  VStack,
  Flex,
} from "native-base";
import { _showDBGeoJSON, _showLocationGPS } from "../Utils/Common";

const MapScreen = ({ route, navigation }) => {
  const [msg, setMsg] = useState("");
  const Map_Ref = useRef();
  const { db } = route.params;
  const { isLoading } = route.params;

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
      _showDBGeoJSON(db, Map_Ref);
      // _showGEOJSONFILE(dlm);
    })();
  }, []);

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
          <View style={styles.Text}>
            <Text>Bạn đang ở tọa độ: {msg}</Text>
          </View>
          <SafeAreaView style={styles.Container}>
            <WebView
              ref={Map_Ref}
              source={{ html: html_script }}
              style={styles.Webview}
            />
            <VStack space="2.5" mt="1.5" px="8">
              <HStack space={3} justifyContent="center">
                <Button
                  size="sm"
                  onPress={() => {
                    navigation.navigate("MapDrawPoint", {
                      db: db,
                    });
                  }}
                >
                  DRAW POINT
                </Button>
                <Button
                  size="sm"
                  colorScheme="secondary"
                  onPress={() => {
                    navigation.navigate("MapDrawLine", {
                      db: db,
                    });
                  }}
                >
                  DRAW LINESTRING
                </Button>
                <Button
                  size="sm"
                  colorScheme="emerald"
                  onPress={() => {
                    navigation.navigate("MapDrawPolygon", {
                      db: db,
                    });
                  }}
                >
                  DRAW POLYGON
                </Button>
              </HStack>
            </VStack>
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
    backgroundColor: "#fff",
    margin: 5,
  },
  WebView: {
    flex: 2,
    margin: 20,
  },
  ButtonArea: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  Button: {
    width: 80,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "black",
    alignItems: "center",
  },
  ButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  Text: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
});
