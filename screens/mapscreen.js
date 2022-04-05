import React, { useEffect, useState, useRef } from "react";
import Constants from "expo-constants";
import * as Location from "expo-location";
import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import { WebView } from "react-native-webview";
import html_script from "../html_script/html_script_mapscreen";
import dlm from "../html_script/dulieumau.json";
import axios from "axios";
import {
  Spinner,
  HStack,
  Heading,
  Center,
  NativeBaseProvider,
  Button,
  Modal,
  FormControl,
  Input,
  VStack,
  Text,
  useToast,
} from "native-base";
import { _showDBGeoJSON, _showLocationGPS } from "../Utils/Common";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const MapScreen = ({ route, navigation }) => {
  const [msg, setMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const Map_Ref = useRef();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = React.useState("");
  const [editItems, setEditItems] = useState();
  const [id, setID] = useState();

  const [isLoading, setIsLoading] = useState();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    _showDBGeoJSON(Map_Ref);
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);

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
      _showDBGeoJSON(Map_Ref);
      // _updateMapScreen(Map_Ref);
      // _showGEOJSONFILE(dlm);
    })();
  }, []);

  //gửi id cho server để xóa item
  function _delItems(id) {
    try {
      axios
        .delete("/realestate/delete", { data: { id: id } })
        .then((response) => console.log(response.data))
        .catch((error) => {
          console.error("There was an error! ", error);
        });
    } catch (err) {
      console.log(err);
    }
  }

  //Nhận data từ WebView
  function onMessage(payload) {
    let dataPayload;
    try {
      dataPayload = JSON.parse(payload.nativeEvent.data);
    } catch (e) {
      console.log(e);
    }

    if (Number.isInteger(dataPayload)) {
      setID(dataPayload);
      setShowModal(true);
    } else if (Number.isInteger(Number.parseInt(dataPayload[0]))) {
      _delItems(dataPayload);
    } else {
      console.log(dataPayload);
      _handleSaveLatLng(dataPayload);
    }
  }

  function _handleSaveLatLng(dataPayload) {
    navigation.navigate("MapScreen");
    axios
      .put("/realestate/editlatlng", {
        editItems: dataPayload,
      })
      .then((response) => console.log("Edit success !!!"))
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  function _handleSaveName() {
    navigation.navigate("MapScreen");
    axios
      .put("/realestate/editname", {
        id: id,
        name: name,
      })
      .then((response) => console.log("Edit success !!!"))
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  //Xử lý giao diện cho Mapscreen khi sửa
  const _submitObjectName = () => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to save Edit?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            _handleSaveName();
            setName("");
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

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
              onMessage={onMessage}
            />
            <View style={styles.Text}>
              <Text>Bạn đang ở tọa độ: {msg}</Text>
            </View>
          </SafeAreaView>
          {/* <Button onPress={() => setShowModal(true)}>Save</Button> */}
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <Modal.Content maxWidth="400px">
              <Modal.CloseButton />
              <Modal.Header>Đổi tên</Modal.Header>
              <Modal.Body>
                <FormControl>
                  <FormControl.Label>Nhập tên muốn đổi:</FormControl.Label>
                  <Input
                    value={name}
                    placeholder={name}
                    onChangeText={(e) => setName(e)}
                  />
                  <Text color="error.500">{errMsg}</Text>
                </FormControl>
              </Modal.Body>
              <Modal.Footer>
                <Button.Group space={2}>
                  <Button
                    variant="ghost"
                    colorScheme="blueGray"
                    onPress={() => {
                      setShowModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={() => {
                      if (!name) {
                        setErrMsg("Vui lòng nhập tên !!!");
                      } else {
                        setShowModal(false);
                        _submitObjectName();
                      }
                    }}
                  >
                    Save
                  </Button>
                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </NativeBaseProvider>
      </>
    );
  }
  return (
    <>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {mapscreen}
      </ScrollView>
    </>
  );
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
