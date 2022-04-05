import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MapScreen from "./screens/mapscreen";
import MapDrawPoint from "./screens/mapdraw_point";
import HomeScreen from "./screens/homescreen";
import MapDrawLine from "./screens/mapdraw_linestring";
import MapDrawPolygon from "./screens/mapdraw_polygon";

const Stack = createNativeStackNavigator();

import { createDrawerNavigator } from "@react-navigation/drawer";
const Drawer = createDrawerNavigator();

import axios from "axios";
//TTHL
// axios.defaults.baseURL = "http://10.10.48.116:4000";
//KTX
axios.defaults.baseURL = "http://10.1.15.213:4000";

export default function App() {
  const [responseData, setResponseData] = useState();
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
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
          name="MapDrawPoint"
          component={MapDrawPoint}
          options={{ title: "Thêm điểm" }}
        />
        <Drawer.Screen
          name="MapDrawLine"
          component={MapDrawLine}
          options={{ title: "Thêm đường" }}
        />
        <Drawer.Screen
          name="MapDrawPolygon"
          component={MapDrawPolygon}
          options={{ title: "Thêm vùng" }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
