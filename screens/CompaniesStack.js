import { createStackNavigator } from '@react-navigation/stack';
import CompaniesScreen from './CompaniesScreen';
import CompanyDetailScreen from './CompanyDetailScreen';
import DomainDetailScreen from './DomainDetailScreen';

const Stack = createStackNavigator();

export default function CompaniesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CompaniesMain" component={CompaniesScreen} />
      <Stack.Screen name="CompanyDetails" component={CompanyDetailScreen} />
      <Stack.Screen name="DomainDetails" component={DomainDetailScreen} />
    </Stack.Navigator>
  );
}