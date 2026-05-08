import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  Keyboard,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Searchbar, Text } from 'react-native-paper';
import { primaryTextColor } from '../constants/Colors';

const { width } = Dimensions.get('window');

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  showBackButton?: boolean;
  onBackPress?: () => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
  onFocus,
  onBlur,
  showBackButton = false,
  onBackPress,
  placeholder = '¿Qué necesitas hoy?',
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showCancelButton, setShowCancelButton] = useState(false);
  const searchInputRef = useRef<TextInput>(null);
  const appbarWidth = useRef(new Animated.Value(1)).current;

  const handleBackPress = () => {
    setIsFocused(false);
    if (onBlur) {
      onBlur();
    }
    if (onBackPress) {
      onBackPress();
    }
    Keyboard.dismiss();
  };

  const handleChange = (text: string) => {
    onChangeText(text);
  };

  const handleSubmit = () => {
    onSubmit();
    Keyboard.dismiss();
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) {
      onFocus();
    }
    if (Platform.OS === 'ios') {
      setShowCancelButton(true);
      Animated.timing(appbarWidth, {
        toValue: 0.99,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) {
      onBlur();
    }
    if (Platform.OS === 'ios') {
      setShowCancelButton(false);
      Animated.timing(appbarWidth, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleCancel = () => {
    onChangeText('');
    setShowCancelButton(false);
    Keyboard.dismiss();
    Animated.timing(appbarWidth, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      setIsFocused(false);
      if (onBlur) {
        onBlur();
      }
    });
  };

  const androidContent = (
    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
      <TouchableOpacity
        onPress={handleBackPress}
        style={[
          styles.internalBackButton,
          !isFocused && Platform.OS === 'android' && { width: 0, opacity: 0 }
        ]}
      >
        <Ionicons name="arrow-back" size={24} color={primaryTextColor} />
      </TouchableOpacity>
      <Searchbar
        placeholder={placeholder}
        onChangeText={handleChange}
        onIconPress={handleSubmit}
        style={{ flex: 1, height: 50 }}
        icon={() => <Ionicons name="search" size={24} color={primaryTextColor} />}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        focusable={true}
        onPress={handleFocus}
      />
    </View>
  );

  const iosContent = (
    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
      <Ionicons name="search" size={24} color={primaryTextColor} style={{ marginHorizontal: 8 }} />
      <TextInput
        ref={searchInputRef}
        placeholder={placeholder}
        onChangeText={handleChange}
        onSubmitEditing={handleSubmit}
        style={[styles.iosSearchBarStyle, styles.iosSearchInputStyle, { flex: 1 }]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={value}
      />
      {showCancelButton && (
        <TouchableOpacity onPress={handleCancel}>
          <Text>Cancelar</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {showBackButton && Platform.OS === 'android' && !isFocused && (
        <TouchableOpacity onPress={onBackPress} style={{ marginRight: 8 }}>
          <Ionicons name="arrow-back" size={24} color={primaryTextColor} />
        </TouchableOpacity>
      )}
      <Animated.View style={{ flex: Platform.OS === 'ios' ? appbarWidth : 1 }}>
        {Platform.OS === 'android' ? androidContent : iosContent}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  internalBackButton: {
    marginRight: 8,
  },
  iosSearchBarStyle: Platform.OS === 'ios'
    ? {
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
      }
    : {},
  iosSearchInputStyle: Platform.OS === 'ios'
    ? {
        fontSize: 17,
        color: primaryTextColor,
        marginRight: 8,
      }
    : {},
});
