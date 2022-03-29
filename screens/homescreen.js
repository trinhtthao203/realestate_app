import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { icons } from "../Contants";
// import {sessionStorage} from '../Utils/Storage';

export default function HomeScreen({ navigation }) {
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
    <View style={styles.Container}>
      <Image
        source={icons.map_icon_color}
        resizeMode="contain"
        style={{ width: 70, height: 70 }}
      />
      <Text style={styles.txtStyle}>Welcome to Demo HomeApp</Text>
      <TouchableOpacity
        onPress={() => {
          /* 1. Navigate to the Details route with params */
          navigation.navigate("MapScreen", {
            db: responseData,
            isLoading: isLoading,
          });
        }}
      >
        <Text style={styles.textButton}>☁ Go to Details ➽</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#60a3bc",
    margin: 10,
  },
  txtStyle: {
    color: "#f7f1e3",
    fontSize: 40,
    fontWeight: "bold",
    margin: 20,
  },
  textButton: {
    color: "#f7f1e3",
    fontSize: 20,
    margin: 10,
  },
});
