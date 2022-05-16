import React, { useEffect, useState, useRef } from "react";
import {
  Alert,
  Text,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";
import html_script_planningarea from "../html_script/html_script_planningarea";
import {
  Button,
  Modal,
  Input,
  TextArea,
  FormControl,
  NativeBaseProvider,
} from "native-base";
import axios from "axios";
import { _showPlanningArea } from "../Utils/Common";
import { COLORS } from "../Contants";
const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
const PlanningArea = ({ route, navigation }) => {
  const Map_Ref = useRef();

  const [id, setID] = useState(0);
  const [idTK, setIDTK] = useState(0);
  const [mota, setMoTa] = useState("");
  const [vitri, setViTri] = useState();
  const [duyet, setDuyet] = useState(1);
  const [diachi, setDiaChi] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  const [newDiaChi, setNewDiaChi] = useState("");
  const [newMoTa, setNewMoTa] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  useEffect(() => {
    _showPlanningArea(Map_Ref);
    onRefresh();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    _showPlanningArea(Map_Ref);
    wait(1000).then(() => {
      setRefreshing(false);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      _showPlanningArea(Map_Ref);
    });
    return unsubscribe;
  }, [navigation]);

  //
  const _handleSave = () => {
    return Alert.alert("Chắc chắn lưu?", "Bạn chắc chắn lưu điểm vừa tạo?", [
      // The "Yes" button
      {
        text: "Vâng",
        onPress: () => {
          Map_Ref.current.injectJavaScript(`           
            drawnItems.clearLayers();
            k--;
            `);
          // navigation.navigate("MapScreen");
          axios
            .post("/planning-area/draw", {
              name: name,
              diachi: diachi,
              vitri: vitri,
              mota: mota,
              duyet: duyet,
              idtk: idTK,
            })
            .then((response) => console.log("Tạo thành công"))
            .catch((error) => {
              if (error.response.status === 400) {
                alert(error.response.data.message);
                return;
              } else alert("Lỗi. Vui lòng thử lại lần nữa.");
            });
          setName("");
          setDiaChi("");
          setMoTa("");
          alert("Lưu thành công");
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
              .delete("/planningarea/delete", { data: { id: id } })
              .then((response) => console.log(response.data))
              .catch((error) => {
                if (error.response.status === 400)
                  alert(error.response.data.message);
                else setError("Lỗi. Vui lòng thử lại lần nữa.");
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

  //Xu li khi Nhấn nút lưu tên
  const _handleUpdate = () => {
    return Alert.alert(
      "Chắc chắn thay đổi?",
      "Bạn chắc chắn muốn thay đổi thông tin?",
      [
        // The "Yes" button
        {
          text: "Vâng",
          onPress: () => {
            try {
              axios
                .put("/planningarea/updateInfo", {
                  id: id,
                  newName: newName,
                  newDiaChi: newDiaChi,
                  newMoTa: newMoTa,
                })
                .then((response) => console.log("Edit success !!!"))
                .catch((error) => {
                  if (error.response.status === 400) {
                    alert(error.response.data.message);
                  } else alert("Lỗi. Vui lòng thử lại lần nữa.");
                });
            } catch (err) {
              console.log(err);
            }
            setNewName("");
            setNewDiaChi("");
            setNewMoTa("");
            setShowModalUpdate(false);
            onRefresh();
          },
        },
        {
          text: "Không",
        },
      ]
    );
  };

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
      console.log(dataPayload);
    } else if (typeof dataPayload === "string") {
      console.log(dataPayload);
      setShowModalUpdate(true);
      setID(dataPayload.substring(7, 5));
    } else {
      setViTri(dataPayload);
    }
  }

  let latlng;
  let btnSave;
  if (!vitri || !vitri.features[0]) {
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
      <Text>{JSON.stringify(vitri.features[0].geometry.coordinates)}</Text>
    );
    btnSave = (
      <Button
        onPress={() => {
          setShowModal(false);
          _handleSave();
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
              source={{ html: html_script_planningarea }}
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
                    <FormControl.Label>
                      Tên vùng quy hoạch{" "}
                      <Text style={{ color: COLORS.error700 }}> * </Text>
                    </FormControl.Label>
                    <Input value={name} onChangeText={(e) => setName(e)} />
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>
                      Địa chỉ vùng quy hoạch
                      <Text style={{ color: COLORS.error700 }}> * </Text>
                    </FormControl.Label>
                    <Input value={diachi} onChangeText={(e) => setDiaChi(e)} />
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>Mô tả</FormControl.Label>
                    <TextArea
                      h={20}
                      value={mota}
                      onChangeText={(e) => setMoTa(e)}
                    />
                  </FormControl>
                  <FormControl mt="3">
                    <ScrollView>
                      <FormControl.Label>Vị trí</FormControl.Label>
                      {latlng}
                    </ScrollView>
                  </FormControl>
                  <FormControl mt="3">
                    <FormControl.Label>
                      <Text style={{ color: COLORS.error700 }}>* </Text>{" "}
                      <Text style={{ color: COLORS.warmGrey600 }}>
                        Bắt buộc
                      </Text>
                    </FormControl.Label>
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
                    <FormControl.Label>
                      Nhập tên mới:
                      <Text style={{ color: COLORS.error700 }}> * </Text>
                    </FormControl.Label>
                    <Input
                      value={newName}
                      onChangeText={(e) => setNewName(e)}
                    />
                    <FormControl.Label>
                      Nhập địa chỉ mới:{" "}
                      <Text style={{ color: COLORS.error700 }}> * </Text>
                    </FormControl.Label>
                    <Input
                      value={newDiaChi}
                      onChangeText={(e) => setNewDiaChi(e)}
                    />
                    <FormControl.Label>
                      Nhập mô tả mới:{" "}
                      <Text style={{ color: COLORS.error700 }}> * </Text>
                    </FormControl.Label>
                    <Input
                      value={newMoTa}
                      onChangeText={(e) => setNewMoTa(e)}
                    />
                    <Text style={{ color: COLORS.error700 }}> {errMsg}</Text>
                  </FormControl>
                  <FormControl mt="3">
                    <FormControl.Label>
                      <Text style={{ color: COLORS.error700 }}>* </Text>{" "}
                      <Text style={{ color: COLORS.warmGrey600 }}>
                        Bắt buộc
                      </Text>
                    </FormControl.Label>
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
                        if (!newName || !newDiaChi || !newMoTa) {
                          setErrMsg("Vui lòng nhập các trường bắt buộc !!!");
                        } else {
                          setShowModal(false);
                          _handleUpdate();
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

export default PlanningArea;
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
