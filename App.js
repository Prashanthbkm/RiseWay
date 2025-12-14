import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Screens
import AppWelcomeScreen from './screens/AppWelcomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import LanguagesStack from './screens/LanguagesStack';
import CompaniesStack from './screens/CompaniesStack';

// ✅ Correct import for Expo
import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

function MainApp() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#f7fafc' }}>
      <StatusBar style="dark" translucent />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Welcome') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Languages') {
                iconName = focused ? 'code-slash' : 'code-slash-outline';
              } else if (route.name === 'Companies') {
                iconName = focused ? 'business' : 'business-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              }

              return <Ionicons name={iconName} size={28} color={color} />;
            },

            tabBarStyle: {
              backgroundColor: '#184e77',
              borderTopLeftRadius: 22,
              borderTopRightRadius: 22,
              height: 62,
              position: 'absolute',
              left: 8,
              right: 8,
              bottom: 10,
              elevation: 7,
            },

            tabBarActiveTintColor: '#ffd166',
            tabBarInactiveTintColor: '#fff',

            tabBarLabelStyle: {
              fontWeight: '600',
              fontSize: 14,
              paddingBottom: 5,
              letterSpacing: 0.5,
            },

            headerShown: false,
          })}
        >
          <Tab.Screen name="Welcome" component={AppWelcomeScreen} />
          <Tab.Screen name="Languages" component={LanguagesStack} />
          <Tab.Screen name="Companies" component={CompaniesStack} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}
