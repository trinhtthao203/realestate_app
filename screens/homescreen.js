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
          /* 1. Navigate to the Details */
          navigation.navigate("MapScreen");
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
    margin: 5,
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
