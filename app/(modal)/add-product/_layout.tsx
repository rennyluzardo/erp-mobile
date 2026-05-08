import { Stack } from 'expo-router';
import { AddProductProvider } from '../../../contexts/AddProductContext';

export default function AddProductLayout() {
  return (
    <AddProductProvider>
      <Stack screenOptions={{ 
        headerShown: false,
        headerTransparent: true,
        header: () => null
      }}>
        <Stack.Screen 
          name="step1" 
          options={{ 
            headerShown: false,
            presentation: 'transparentModal',
            animation: 'slide_from_bottom',
            header: () => null
          }} 
        />
        <Stack.Screen 
          name="step2" 
          options={{ 
            headerShown: false,
            presentation: 'transparentModal',
            animation: 'slide_from_bottom',
            header: () => null
          }} 
        />
        <Stack.Screen 
          name="step3" 
          options={{ 
            headerShown: false,
            presentation: 'transparentModal',
            animation: 'slide_from_bottom',
            header: () => null
          }} 
        />
      </Stack>
    </AddProductProvider>
  );
}
