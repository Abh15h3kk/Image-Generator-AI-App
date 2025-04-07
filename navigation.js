import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import TextToImageScreen from './screens/TextToImageScreen';
import TextToPngScreen from './screens/TextToPngScreen';
import BackgroundRemoverScreen from './screens/BackgroundRemoverScreen';
import AiBackgroundScreen from './screens/AiBackgroundScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TextToImage" component={TextToImageScreen} />
        <Stack.Screen name="TextToPng" component={TextToPngScreen} />
        <Stack.Screen name="BackgroundRemover" component={BackgroundRemoverScreen} />
        <Stack.Screen name="AiBackground" component={AiBackgroundScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
