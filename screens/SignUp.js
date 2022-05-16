import React, { useState } from "react";
import {
  Box,
  Input,
  Button,
  VStack,
  Center,
  Image,
  Heading,
  useToast,
  ScrollView,
  FormControl,
  NativeBaseProvider,
  Container,
  View,
} from "native-base";

import { Platform } from "react-native";
import { icons } from "../Contants";
import { COLORS } from "../Contants/theme";
import { AuthContext } from "../Components/Context";
import { Text, TouchableHighlight } from "react-native";
import { Avatar } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
const SignIn = () => {
  const [ngaysinh, setNgaySinh] = useState(new Date());

  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [isUploadAvatar, setisUploadAvatar] = useState(false);

  const [urlAvatar, setUrlAvatar] = useState();
  const { SignIn } = React.useContext(AuthContext);

  const _onChange = (e, selectedDate) => {
    const currentDate = selectedDate || ngaysinh;
    setShow(Platform.OS === "ios");
    setNgaySinh(currentDate);

    let temp = new Date(currentDate);
    let fDate =
      temp.getDate() + "/" + (temp.getMonth() + 1) + "/" + temp.getFullYear();
    console.log(fDate);
  };

  const _ShowMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  let uploadAvartar;
  if (!isUploadAvatar) {
    uploadAvartar = (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: 120,
          width: 120,
          backgroundColor: COLORS.warmGrey200,
          borderRadius: 20,
        }}
      >
        <Image
          size={7}
          resizeMode={"contain"}
          borderRadius={100}
          source={icons.ic_add_image}
          alt="Alternate Text"
        />
      </View>
    );
  } else {
    uploadAvartar = (
      <Image
        size={150}
        resizeMode={"contain"}
        borderRadius={100}
        source={icons.ic_add_image}
        alt="Alternate Text"
      />
    );
  }

  return (
    <NativeBaseProvider>
      <ScrollView>
        <Center flex={1} px="3">
          <Center w="100%">
            <Box safeArea p="2" w="90%" maxW="290" py="8">
              <Heading
                size="lg"
                color="coolGray.800"
                _dark={{
                  color: "warmGray.50",
                }}
                fontWeight="semibold"
              >
                Welcome
              </Heading>
              <Heading
                mt="1"
                color="coolGray.600"
                _dark={{
                  color: "warmGray.200",
                }}
                fontWeight="medium"
                size="xs"
              >
                Đăng ký để tiếp tục!
              </Heading>
              <VStack space={3} mt="5">
                <FormControl.Label>Ảnh đại diện</FormControl.Label>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <TouchableHighlight
                    style={{
                      height: 120,
                      borderRadius: 20,
                    }}
                    onPress={() => alert("Image picker")}
                    underlayColor={COLORS.indigo500}
                  >
                    {uploadAvartar}
                  </TouchableHighlight>
                </View>
                <FormControl>
                  <FormControl.Label>Tài khoản</FormControl.Label>
                  <Input />
                </FormControl>
                <FormControl>
                  <FormControl.Label>Họ tên</FormControl.Label>
                  <Input />
                </FormControl>
                <FormControl>
                  <FormControl.Label>Giới tính</FormControl.Label>
                  <Input />
                </FormControl>
                <FormControl>
                  <FormControl.Label>Ngày sinh</FormControl.Label>
                  <Button
                    title="Chọn ngày"
                    style={{ backgroundColor: COLORS.warmGrey200 }}
                    onPress={() => _ShowMode("date")}
                  >
                    <Text style={{ color: COLORS.warmGrey800 }}>
                      Chọn ngày 📆
                    </Text>
                  </Button>
                </FormControl>
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={ngaysinh}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={_onChange}
                  />
                )}
                <FormControl>
                  <FormControl.Label>Mật khẩu</FormControl.Label>
                  <Input type="password" />
                </FormControl>
                <FormControl>
                  <FormControl.Label>Xác nhận mật khẩu</FormControl.Label>
                  <Input type="password" />
                </FormControl>
                <Button mt="2" colorScheme="indigo">
                  Đăng ký
                </Button>
              </VStack>
            </Box>
          </Center>
        </Center>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default SignIn;
