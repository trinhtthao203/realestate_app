import "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./Components/Context";
import { icons, theme } from "./Contants";
import Constants from "expo-constants";
import * as Location from "expo-location";
import axios from "axios";

import ActivityScreen from "./screens/ActivityScreen";
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import RealEstate from "./screens/RealEstate";
import PlanningArea from "./screens/PlanningArea";

import { CustomDrawer } from "./screens/CustomDrawer";
import SignUp from "./screens/SignUp";
import Login from "./screens/Login";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

axios.defaults.baseURL = "http://192.168.75.91:4000";
// axios.defaults.baseURL = "http://10.1.15.238:4000";
// axios.defaults.baseURL = "http://10.13.144.133:4000";

export default function App() {
  const [responseData, setResponseData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const [isLogin, setIsLogin] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState();

  const load = async () => {
    try {
      var userInfo = await AsyncStorage.getItem("user");
      if (userInfo != null) {
        setUser(userInfo);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: () => {
        setUserToken("khir");
        setIsLoading(false);
      },
      signOut: () => {
        setUserToken(null);
        setIsLoading(false);
      },
      signUp: () => {
        setUserToken("khir");
        setIsLoading(false);
      },
    }),
    []
  );

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

  if (isLoading) {
    return <ActivityScreen />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Drawer.Navigator
        // drawerContent={(props) => <CustomDrawer {...props} />}
        // screenProps={{ user: user }}
        >
          {/* {userToken == null ? (
            <>
              <Drawer.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
              />
              <Drawer.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ title: "Trang chủ" }}
                initialParams={{
                  responseData: responseData,
                  isLoading: isLoading,
                }}
              />
            </>
          ) : (
            <Drawer.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{ title: "Trang chủ" }}
              initialParams={{
                responseData: responseData,
                isLoading: isLoading,
              }}
            />
          )} */}
          <Drawer.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ title: "Home Page" }}
            initialParams={{
              responseData: responseData,
              isLoading: isLoading,
              headerShown: false,
            }}
          />
          <Drawer.Screen
            name="Bản đồ"
            component={MapScreen}
            // initialParams={{
            //   gps: getloca,
            // }}
          />
          <Drawer.Screen name="Bất động sản" component={RealEstate} />
          <Drawer.Screen name="Vùng quy hoạch" component={PlanningArea} />
          {/* <Drawer.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          /> */}
        </Drawer.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
