import "react-native-gesture-handler";
import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MapScreen from "./screens/mapscreen";
import HomeScreen from "./screens/homescreen";
import MapDraw from "./screens/mapdraw";

const Stack = createNativeStackNavigator();

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
const Drawer = createDrawerNavigator();

import axios from "axios";
import { Center, NativeBaseProvider, Text, Image } from "native-base";
//TTHL
axios.defaults.baseURL = "http://10.1.14.193:4000";
//KTX
// axios.defaults.baseURL = "http://10.1.15.213:4000";
// axios.defaults.baseURL = "http://192.168.246.91:4000";

export default function App() {
  const [responseData, setResponseData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  const fetchData = async () => {
    try {
      const result = await axios({
        method: "GET",
        url: "/realestate",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        params: {
          search: "parameter",
        },
      });
      setResponseData(result.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  let textDrawer;
  if (isLogin) {
    textDrawer = (
      <Text fontSize="md" color="tertiary.50">
        Họ tên
      </Text>
    );
  } else {
    textDrawer = (
      <Text fontSize="md" color="tertiary.50">
        Đăng nhập /Đăng ký
      </Text>
    );
  }

  const CustomDrawer = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        <NativeBaseProvider>
          <Center h="40" w="280" bg="#134e4a" shadow={3}>
            <Image
              source={{
                uri: "https://cdn-icons.flaticon.com/png/512/560/premium/560277.png?token=exp=1650339292~hmac=a1c488d076145d7f71000f98880a9965",
              }}
              width={100}
              height={100}
            />
            {textDrawer}
          </Center>
        </NativeBaseProvider>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    );
  };

  const DrawerNavigation = () => {
    return (
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawer {...props} />}
      >
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Trang chủ" }}
          initialParams={{
            responseData: responseData,
            isLoading: isLoading,
          }}
        />
        <Drawer.Screen
          name="MapScreen"
          component={MapScreen}
          options={{ title: "Vị trí hiện tại" }}
        />
        <Drawer.Screen
          name="MapDraw"
          component={MapDraw}
          options={{ title: "Thêm đối tượng" }}
        />
      </Drawer.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <DrawerNavigation />
    </NavigationContainer>
  );
}
