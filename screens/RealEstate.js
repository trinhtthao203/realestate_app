import React, { useEffect, useState, useRef } from "react";
import {
  Alert,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { WebView } from "react-native-webview";
import html_script_realestate from "../html_script/html_script_realestate";
import {
  Button,
  Modal,
  FormControl,
  Input,
  NativeBaseProvider,
  Slide,
} from "native-base";
import axios from "axios";
import { _showRealEstate } from "../Utils/Common";
const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const RealEstate = ({ navigation }) => {
  const Map_Ref = useRef();
  const [id, setID] = useState();
  const [name, setName] = React.useState("");
  const [errMsg, setErrMsg] = useState("");
  const [newName, setNewName] = React.useState("");
  const [editItems, setEditItems] = useState();
  const [objectDraw, setObjectDraw] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  useEffect(() => {
    _showRealEstate(Map_Ref);
    onRefresh();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    _showRealEstate(Map_Ref);
    wait(1000).then(() => {
      setRefreshing(false);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      _showRealEstate(Map_Ref);
    });
    return unsubscribe;
  }, [navigation]);

  const _submitObject = () => {
    return Alert.alert("Chắc chắn lưu?", "Bạn chắc chắn lưu điểm vừa tạo?", [
      // The "Yes" button
      {
        text: "Vâng",
        onPress: () => {
          Map_Ref.current.injectJavaScript(`   
            k--;        
            drawnItems.clearLayers();
            `);
          axios
            .post("/realestate/draw", {
              name: name,
              objectDraw: objectDraw,
            })
            .then((response) => console.log(name, objectDraw))
            .catch((error) => {
              console.error("There was an error!", error);
            });
          setObjectDraw("");
          setName("");
          onRefresh();
        },
      },
      {
        text: "Hủy",
      },
    ]);
  };

  //gửi id cho server để xóa item
  function _delItems(id) {
    return Alert.alert("Chắc chắn xóa?", "Bạn chắc chắn xóa điểm vừa chọn?", [
      // The "Yes" button
      {
        text: "Vâng",
        onPress: () => {
          Map_Ref.current.injectJavaScript(`   
            k--;        
            `);
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
          onRefresh();
        },
      },
      {
        text: "Hủy",
      },
    ]);
  }

  //Nhận data từ WebView
  function onMessage(payload) {
    let dataPayload;
    try {
      dataPayload = JSON.parse(payload.nativeEvent.data);
    } catch (e) {
      console.log(e);
    }

    if (typeof dataPayload === "number") {
      _delItems(dataPayload);
    } else if (typeof dataPayload === "string") {
      setShowModalUpdate(true);
      setID(dataPayload.substring(7, 5));
    } else {
      setObjectDraw(dataPayload);
    }
  }

  //Xử lý giao diện cho Mapscreen khi sửa
  const _handleSaveName = () => {
    return Alert.alert("Chắc chắn thay đổi?", "Bạn chắc chắn muốn đổi tên", [
      // The "Yes" button
      {
        text: "Vâng",
        onPress: () => {
          try {
            axios
              .put("/realestate/editname", {
                id: id,
                newName: newName,
              })
              .then((response) => console.log("Edit success !!!"))
              .catch((error) => {
                console.error("There was an error!", error);
              });
          } catch (err) {
            console.log(err);
          }
          setNewName("");
          setShowModalUpdate(false);
          onRefresh();
        },
      },
      {
        text: "Không",
      },
    ]);
  };

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
      <ScrollView contentContainerStyle={styles.scrollView}>
        <SafeAreaView style={styles.Container}>
          <NativeBaseProvider>
            <WebView
              ref={Map_Ref}
              source={{ html: html_script_realestate }}
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

            <Modal
              isOpen={showModalUpdate}
              onClose={() => setShowModalUpdate(false)}
            >
              <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>Đổi tên</Modal.Header>
                <Modal.Body>
                  <FormControl>
                    <FormControl.Label>Nhập tên muốn đổi:</FormControl.Label>
                    <Input
                      value={newName}
                      placeholder={newName}
                      onChangeText={(e) => setNewName(e)}
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
                        if (!newName) {
                          setErrMsg("Vui lòng nhập tên !!!");
                        } else {
                          setShowModal(false);
                          _handleSaveName();
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
        </SafeAreaView>
      </ScrollView>
    </>
  );
};

export default RealEstate;
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 5,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
});
