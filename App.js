import "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./Components/Context";
import { icons, theme } from "./Contants";
import axios from "axios";

import { CustomDrawer } from "./screens/CustomDrawer";
import ActivityScreen from "./screens/ActivityScreen";
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import MapDraw from "./screens/MapDraw";
import SignUp from "./screens/SignUp";
import Login from "./screens/Login";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

axios.defaults.baseURL = "http://10.1.14.193:4000";

export default function App() {
  const [responseData, setResponseData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [userToken, setUserToken] = useState(null);

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
          drawerContent={(props) => <CustomDrawer {...props} />}
        >
          {userToken == null ? (
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
          )}

          <Drawer.Screen name="MapScreen" component={MapScreen} />
          <Drawer.Screen name="MapDraw" component={MapDraw} />
          <Drawer.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
