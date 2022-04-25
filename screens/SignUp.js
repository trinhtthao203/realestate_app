import React, { useState } from "react";
import {
  Box,
  Input,
  Button,
  VStack,
  Center,
  Heading,
  ScrollView,
  FormControl,
  NativeBaseProvider,
} from "native-base";

import { Text } from "react-native";
import { Platform } from "react-native";
import { COLORS } from "../Contants/theme";
import { AuthContext } from "../Components/Context";
import DateTimePicker from "@react-native-community/datetimepicker";

const SignIn = () => {
  const [ngaysinh, setNgaySinh] = useState(new Date());

  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const { SignIn } = React.useContext(AuthContext);

  const onChange = (e, selectedDate) => {
    const currentDate = selectedDate || ngaysinh;
    setShow(Platform.OS === "ios");
    setNgaySinh(currentDate);

    let temp = new Date(currentDate);
    let fDate =
      temp.getDate() + "/" + (temp.getMonth() + 1) + "/" + temp.getFullYear();
    console.log(fDate);
  };

  const ShowMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

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
                <FormControl>
                  <FormControl.Label>Email</FormControl.Label>
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
                    onPress={() => ShowMode("date")}
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
                    onChange={onChange}
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
