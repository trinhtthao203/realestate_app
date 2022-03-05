import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from './screen/mapscreen';
import MapDraw from './screen/mapdraw';

const Stack = createNativeStackNavigator();

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