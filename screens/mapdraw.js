import React, { useEffect, useState, useRef } from "react";
import {
  Alert,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";
import html_script_mapdrawfull from "../html_script/html_script_mapdrawfull";
import {
  Button,
  Modal,
  FormControl,
  Input,
  NativeBaseProvider,
} from "native-base";
import axios from "axios";
// import { _setToolPoint } from "../Utils/Common";

const MapDraw = ({ route, navigation }) => {
  const [objectDraw, setObjectDraw] = useState("");
  const [name, setName] = React.useState("");
  const [showModal, setShowModal] = useState(false);
  const Map_Ref = useRef();

  const _submitObject = () => {
    return Alert.alert("Chắc chắn lưu?", "Bạn chắc chắn lưu điểm vừa tạo?", [
      // The "Yes" button
      {
        text: "Vâng",
        onPress: () => {
          Map_Ref.current.injectJavaScript(`           
            drawnItems.clearLayers();
            `);
          navigation.navigate("MapScreen");
          axios
            .post("/realestate/draw", {
              name: name,
              objectDraw: objectDraw,
            })
            .then((response) => console.log(name, objectDraw))
            .catch((error) => {
              console.error("There was an error!", error);
            });

          setName("");
        },
      },
      {
        text: "Hủy",
      },
    ]);
  };

  function onMessage(payload) {
    let dataPayload;
    try {
      dataPayload = JSON.parse(payload.nativeEvent.data);
    } catch (e) {
      console.log(e);
    }

    if (dataPayload) {
      console.log(dataPayload);
      setObjectDraw(dataPayload);
    }
  }

  let latlng;
  let btnSave;
  if (!objectDraw || !objectDraw.features[0]) {
    latlng = <Text>Bạn chưa tạo đối tượng !!!</Text>;
    btnSave = (
      <Button
        onPress={() => {
          alert("Vui lòng tạo địa điểm");
        }}
      >
        Save
      </Button>
    );
  } else {
    latlng = (
      <Text>{JSON.stringify(objectDraw.features[0].geometry.coordinates)}</Text>
    );
    btnSave = (
      <Button
        onPress={() => {
          setShowModal(false);
          _submitObject();
        }}
      >
        Save
      </Button>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.Container}>
        <NativeBaseProvider>
          <WebView
            ref={Map_Ref}
            source={{ html: html_script_mapdrawfull }}
            style={styles.Webview}
            onMessage={onMessage}
          />
          <Button onPress={() => setShowModal(true)}>Save</Button>
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <Modal.Content maxWidth="400px">
              <Modal.CloseButton />
              <Modal.Header>Lưu đối tượng</Modal.Header>
              <Modal.Body>
                <FormControl>
                  <FormControl.Label>Tên</FormControl.Label>
                  <Input value={name} onChangeText={(e) => setName(e)} />
                </FormControl>
                <FormControl mt="3">
                  <ScrollView>
                    <FormControl.Label>Vị trí</FormControl.Label>
                    {latlng}
                  </ScrollView>
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
                    HỦY
                  </Button>
                  {btnSave}
                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </NativeBaseProvider>
      </SafeAreaView>
    </>
  );
};

export default MapDraw;
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
});
