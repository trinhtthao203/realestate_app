import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import imgs from "../Contants/imgs";
import icons from "../Contants/icons";

export default function HomeScreen() {
  return (
    <View style={styles.Container}>
      <View>
        <Text
          style={{
            textAlign: "center",
            color: "#218C95",
            fontWeight: "bold",
            fontSize: 20,
          }}
        >
          SRES
        </Text>
        <Text style={{ color: "#878D9A" }}>Search Real Estate</Text>
      </View>
      <Image
        source={imgs.house_image}
        resizeMode="contain"
        style={{ width: "100%", height: "50%" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCFCFC",
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
