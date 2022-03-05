import React,{useEffect, useState, useRef} from "react";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { View ,Text, SafeAreaView, StyleSheet, Button, ScrollView } from "react-native";
import { WebView } from "react-native-webview";
import html_script from "../html_script/html_script_mapscreen";
import dlm from "../html_script/dulieumau.json";

const MapScreen =({navigation})=> {
  const [msg, setMsg] = useState('');
  const [location, setLocation] = useState();
  const Map_Ref = useRef();

  useEffect(()=>{
    (async () => {
      if (Platform.OS === "android" && !Constants.isDevice) {
        setMsg("Oops, this will not work on Snack in an Android emulator. Try it on your device!")
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setMsg("Permission to access location was denied")
        return;
      }
      let getloca = await Location.getCurrentPositionAsync({});
      setMsg(`[${getloca.coords.latitude}, ${getloca.coords.longitude}]`);
      setLocation(getloca);
      getLocation(getloca);
      getGEOJSON();
    })();
  },[])
  
  const getLocation=(location)=>{
    if (!location) {
      console.log("Your browser dont support geolocation feature!");
    } else {
      // console.log(location);
      var lat = location.coords.latitude;
      var long = location.coords.longitude;
      var accuracy = location.coords.accuracy;

      Map_Ref.current.injectJavaScript(`
        var marker, circle;
        if (marker) {
          mymap.removeLayer(marker);
        }
        if (circle) {
          mymap.removeLayer(circle);
        }
          marker = L.marker([${lat}, ${long}]);
          circle = L.circle([${lat}, ${long}], { radius: ${accuracy} });
          var featureGroup = L.featureGroup([marker, circle]).addTo(mymap);
          mymap.fitBounds(featureGroup.getBounds());
      `);
    }
  }
  const getGEOJSON=()=>{
    Map_Ref.current.injectJavaScript(`
    var geo =${JSON.stringify(dlm)};
    L.geoJSON(geo,{
      	onEachFeature:onEachFeature,
      	style: function (feature) {	 //qui định style cho các đối tượng
      		switch (feature.geometry.type) {
      			// case 'Point': return pointStyle;
      			case 'LineString':   return lineStyle;
      			case 'Polygon':   return polygonStyle;
      		}
      	},
      	pointToLayer: function (feature, latlng) {
      		return L.circleMarker(latlng, geojsonMarkerOptions);
      	},
      	filter: function(feature, layer) {
      		return feature.properties.show_on_map;
      	}
      	}).addTo(mymap);
      `);
  };
  
    return (
      <>
        <View style={styles.Text}>
           <Text>Bạn đang ở tọa độ: {msg}</Text>
        </View>
        <SafeAreaView style={styles.Container}>
          <WebView
            ref={Map_Ref}
            source={{html: html_script}}
            style={styles.Webview}
          />
          <Button onPress={()=>navigation.navigate('MapDraw')} title='Draw'/>
        </SafeAreaView>
          
      </>
    );
  }

  export default MapScreen;
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: "#fff",
    margin:20
  },
  WebView: {
    flex: 2,
    margin: 20,
  },
  ButtonArea: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  Button: {
    width: 80,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "black",
    alignItems: "center",
  },
  ButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  Text: {
    justifyContent: "center",
    alignItems: "center",
    marginTop:30
  }
});

