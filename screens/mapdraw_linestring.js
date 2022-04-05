import React, { useEffect, useState, useRef } from "react";
import {
  Alert,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";
import {
  Button,
  Modal,
  FormControl,
  Input,
  NativeBaseProvider,
} from "native-base";
import axios from "axios";
import html_script_mapdraw from "../html_script/html_script_mapdraw";
import { _setToolLineString } from "../Utils/Common";

const MapDrawLine = ({ route, navigation }) => {
  const [objectDraw, setObjectDraw] = useState("");
  const [name, setName] = React.useState("");
  const [showModal, setShowModal] = useState(false);
  const Map_Ref = useRef();

  useEffect(() => {
    _setToolLineString(Map_Ref);
  }, []);

  const _submitObject = () => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to save POINT in map?",
      [
        // The "Yes" button
        {
          text: "Yes",
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
          text: "No",
        },
      ]
    );
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
  if (objectDraw && objectDraw.features[0]) {
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
  } else {
    latlng = <Text>Bạn chưa chọn điểm</Text>;
    btnSave = (
      <Button
        onPress={() => {
          alert("Vui lòng chọn địa điểm");
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
            source={{ html: html_script_mapdraw }}
            style={styles.Webview}
            onMessage={onMessage}
          />
          <Button onPress={() => setShowModal(true)}>Save</Button>
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <Modal.Content maxWidth="400px">
              <Modal.CloseButton />
              <Modal.Header>Save Point to Data</Modal.Header>
              <Modal.Body>
                <FormControl>
                  <FormControl.Label>Name</FormControl.Label>
                  <Input value={name} onChangeText={(e) => setName(e)} />
                </FormControl>
                <FormControl mt="3">
                  <ScrollView>
                    <FormControl.Label>Location</FormControl.Label>
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
                    Cancel
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

export default MapDrawLine;
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
