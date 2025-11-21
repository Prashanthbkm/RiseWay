import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TechLanguagesScreen from './TechLanguagesScreen';
import LanguageDetailScreen from './LanguageDetailScreen';

const Stack = createStackNavigator();

export default function LanguagesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="LanguagesList"
        component={TechLanguagesScreen}
        options={{ title: "Languages" }}
      />
      <Stack.Screen
        name="LanguageDetail"
        component={LanguageDetailScreen}
        options={({ route }) => ({
          title: route.params?.language || "Details",
        })}
      />
    </Stack.Navigator>
  );
}