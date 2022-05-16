import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";

import { icons, theme } from "../Contants";
import { StyleSheet, View } from "react-native";
import { Avatar, Title, Caption, Drawer } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export function CustomDrawer({ props }) {
  // const user = props.screenProps.user;
  // useEffect(() => {
  //   if (route.params?.user) {
  //     user = route.params?.user;
  //   }
  // }, [route.params?.user]);

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <Avatar.Image source={icons.ic_user} size={50} />
              <View style={{ marginLeft: 15, flexDirection: "column" }}>
                <Title style={styles.title}>Trần Văn Hoàng</Title>
                <Caption style={styles.caption}>tvhoang@gmail.com</Caption>
              </View>
            </View>
          </View>
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="home-outline" color={color} size={size} />
              )}
              label="Trang chủ"
              onPress={() => {
                props.navigation.navigate("HomeScreen");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="map-marker" color={color} size={size} />
              )}
              label="Vị trí hiện tại"
              onPress={() => {
                props.navigation.navigate("MapScreen");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="domain-plus" color={color} size={size} />
              )}
              label="Thêm đối tượng"
              onPress={() => {
                props.navigation.navigate("MapDraw");
              }}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Đăng xuất"
          onPress={() => {
            props.navigation.navigate("Login");
          }}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 10,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
