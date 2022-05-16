import React, { useState } from "react";
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
  Center,
  NativeBaseProvider,
} from "native-base";
import axios from "axios";
import { COLORS } from "../Contants/theme";
import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default ({ navigation }) => {
  const [email, setEmail] = useState();
  const [passwd, setPasswd] = useState();
  const [error, setError] = useState("");
  const [user, setUser] = useState();

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("user", value);
    } catch (e) {
      console.log(e);
    }
  };

  const _handleLogIn = () => {
    setError(null);
    axios
      .post("/taikhoan/dangnhap", {
        email: email,
        passwd: passwd,
      })
      .then((response) => {
        console.log("login success");
        setUser(response.data);
        storeData(response.data);
        navigation.navigate("HomeScreen", { user: user });
        setEmail("");
        setPasswd("");
      })
      .catch((error) => {
        if (error.response.status === 401)
          setError(error.response.data.message);
        else if (error.response.status === 400)
          setError(error.response.data.message);
        else setError("Lỗi. Vui lòng thử lại lần nữa.");
        setPasswd("");
      });
  };

  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <Center w="100%">
          <Box safeArea p="2" py="8" w="90%" maxW="290">
            <Heading
              size="lg"
              fontWeight="600"
              color="coolGray.800"
              _dark={{
                color: "warmGray.50",
              }}
            >
              Welcome
            </Heading>
            <Heading
              mt="1"
              _dark={{
                color: "warmGray.200",
              }}
              color="coolGray.600"
              fontWeight="medium"
              size="xs"
            >
              Đăng nhập để tiếp tục!
            </Heading>
            <VStack space={3} mt="5">
              <FormControl>
                <FormControl.Label>Email</FormControl.Label>
                <Input
                  keyboardType="email-address"
                  value={email}
                  onChangeText={(val) => setEmail(val)}
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>Mật khẩu</FormControl.Label>
                <Input
                  type="password"
                  value={passwd}
                  onChangeText={(val) => setPasswd(val)}
                />
                <Link
                  _text={{
                    fontSize: "xs",
                    fontWeight: "500",
                    color: "indigo.500",
                  }}
                  alignSelf="flex-end"
                  mt="1"
                >
                  Quên mật khẩu?
                </Link>
              </FormControl>
              <Text style={{ color: COLORS.error700 }}>{error}</Text>
              <Button
                mt="2"
                colorScheme="indigo"
                onPress={() => _handleLogIn()}
              >
                Đăng nhập
              </Button>
              <HStack mt="6" justifyContent="center">
                <Text
                  fontSize="sm"
                  color="coolGray.600"
                  _dark={{
                    color: "warmGray.200",
                  }}
                >
                  Tôi là người dùng mới.{" "}
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.warmGrey100,
                    padding: 0,
                    margin: 0,
                  }}
                  onPress={() => {
                    navigation.navigate("SignUp");
                  }}
                >
                  <Text style={{ color: COLORS.indigo500 }}>Đăng ký</Text>
                </TouchableOpacity>
              </HStack>
            </VStack>
          </Box>
        </Center>
      </Center>
    </NativeBaseProvider>
  );
};
