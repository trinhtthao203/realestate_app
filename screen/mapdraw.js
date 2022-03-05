import React,{useEffect, useState, useRef} from "react";
import { Alert,TextInput ,Text, SafeAreaView, StyleSheet, Button } from "react-native";
import { WebView } from "react-native-webview";
import html_script_mapdraw from "../html_script/html_script_mapdraw";

const MapDraw =({navigation})=> {
  const [objectDraw, setOnjectDraw] = useState("");
  const Map_Ref = useRef();
  
  const submitObject=()=>{
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to save objects in map?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            Map_Ref.current.injectJavaScript(`           
                drawnItems.clearLayers();
                window.ReactNativeWebView.postMessage(geojson1);
                L.geoJSON(JSON.parse($("#geojsontext1").val())).addTo(drawnItems);
                
                $("#geojsontext1").val('');  
                geojson1='';
            `);
            navigation.navigate('MapScreen');
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  }

  function onMessage(payload) {
    let dataPayload;
    try {
      dataPayload = JSON.parse(payload.nativeEvent.data);
    } catch (e) {}
  
    if (dataPayload) {
      if (dataPayload.type === 'Console') {
        console.info(`[Console] ${JSON.stringify(dataPayload.data)}`);
      } else {
        console.log(dataPayload);
        setOnjectDraw(dataPayload);
      }
    }
  };

  const debugging = `
  const consoleLog = (type, log) => window.ReactNativeWebView.postMessage(JSON.stringify({'type': 'Console', 'data': {'type': type, 'log': log}}));
  console = {
      log: (log) => consoleLog('log', log),
      debug: (log) => consoleLog('debug', log),
      info: (log) => consoleLog('info', log),
      warn: (log) => consoleLog('warn', log),
      error: (log) => consoleLog('error', log),
    };
`;

    return (
      <>
        <SafeAreaView style={styles.Container}>
          <WebView
            scalesPageToFit={false}
            ref={Map_Ref}
            source={{ html: html_script_mapdraw }}
            style={styles.Webview}
            injectedJavaScript={debugging}
            onMessage={onMessage}
          />   
        <SafeAreaView>
          <Button backgroundColor="black" title="Submit" onPress={submitObject}></Button>
        </SafeAreaView>              
        </SafeAreaView>
      </>
    );
  }

export default MapDraw ;
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: "#fff",
    margin:20
  },
  WebView: {
    flex: 2,
    margin: 20,
  }
});
