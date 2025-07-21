import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from './src/screens/HomeScreen';
import ReflectScreen from './src/screens/ReflectScreen';
import HabitsScreen from './src/screens/HabitsScreen';
import ProgressScreen from './src/screens/ProgressScreen';

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({route}) => ({
              tabBarIcon: ({focused, color, size}) => {
                let iconName = '';
                
                switch (route.name) {
                  case 'Home':
                    iconName = 'home';
                    break;
                  case 'Reflect':
                    iconName = 'self-improvement';
                    break;
                  case 'Habits':
                    iconName = 'check-circle';
                    break;
                  case 'Progress':
                    iconName = 'trending-up';
                    break;
                }
                
                return <Icon name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#14B8A6',
              tabBarInactiveTintColor: 'gray',
              headerShown: false,
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Reflect" component={ReflectScreen} />
            <Tab.Screen name="Habits" component={HabitsScreen} />
            <Tab.Screen name="Progress" component={ProgressScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}