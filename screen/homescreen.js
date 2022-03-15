import React,{useEffect, useState} from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import axios from 'axios'

import api from '../api';

export default function HomeScreen({ navigation }) {
    
  const [responseData, setResponseData] = useState();

  const fetchData = async() =>{
      try{
          const result = await axios({
            'method':'GET',
            'url':'/realestate',
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'},
            'params': {
                'search':'parameter',
            },
        })          
          setResponseData(result.data);
      }catch(err){
          console.log(err);
      }
  }

  useEffect(()=>{
    fetchData();
  },[]);

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
          title="Go to Details"
          onPress={() => {
            /* 1. Navigate to the Details route with params */
            navigation.navigate('MapScreen', {
              db:responseData
            });
          }}
        />
      </View>
    );
  }