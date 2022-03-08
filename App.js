import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from './screen/mapscreen';
import MapDraw from './screen/mapdraw';
import axios from 'axios';
const Stack = createNativeStackNavigator();
//TTHL
// axios.defaults.baseURL = 'http://10.10.42.197:4000'
axios.defaults.baseURL = 'http://10.1.13.125:4000'

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MapScreen"
          component={MapScreen}
          options={{ title: 'Vị trí hiện tại' }}
        />
        <Stack.Screen name="MapDraw" component={MapDraw} options={{ title: 'Vẽ trên MAP' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;