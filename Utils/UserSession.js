import AsyncStorage from "@react-native-async-storage/async-storage";

var user = () => {
  try {
    AsyncStorage.getItem("user").then((value) => {
      if (value != null) {
        var userInfo = JSON.parse(value);
        return userInfo;
      }
    });
  } catch (e) {
    console.log(e);
  }
};

export default user;
