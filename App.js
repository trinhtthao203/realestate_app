import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MapScreen from "./screens/mapscreen";
import MapDrawPoint from "./screens/mapdraw_point";
import HomeScreen from "./screens/homescreen";
import axios from "axios";
import MapDrawLine from "./screens/mapdraw_linestring";
import MapDrawPolygon from "./screens/mapdraw_polygon";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

//TTHL
axios.defaults.baseURL = "http://10.10.33.14:4000";
//KTX
// axios.defaults.baseURL = "http://10.1.14.254:4000";

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Trang chủ" }}
        />
        <Stack.Screen
          name="MapScreen"
          component={MapScreen}
          options={{ title: "Vị trí hiện tại" }}
        />
        <Stack.Screen
          name="MapDrawPoint"
          component={MapDrawPoint}
          options={{ title: "Thêm điểm" }}
        />
        <Stack.Screen
          name="MapDrawLine"
          component={MapDrawLine}
          options={{ title: "Thêm đường" }}
        />
        <Stack.Screen
          name="MapDrawPolygon"
          component={MapDrawPolygon}
          options={{ title: "Thêm vùng" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
