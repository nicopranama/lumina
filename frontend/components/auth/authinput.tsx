import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { colors } from '../../constants/theme'
import { AuthInputProps } from '../../types'
import { moderateScale, scale, verticalScale } from '../../utils/styling'

const AuthInput: React.FC<AuthInputProps> = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, secureTextEntry && styles.inputWithIcon]}
        placeholder={placeholder}
        placeholderTextColor={colors.textLightGrey}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        {...props}
      />
      
      {secureTextEntry && (
        <View style={styles.eyeIconContainer}>
          <TouchableOpacity 
            onPress={togglePasswordVisibility}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Ionicons 
              name={isPasswordVisible ? "eye-off" : "eye"} 
              size={22} 
              color={colors.textLightGrey} 
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default AuthInput

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: verticalScale(15),
  },
  input: {
    width: '100%',
    height: verticalScale(50),
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: scale(15),
    fontSize: moderateScale(16),
    fontFamily: 'Sf-Regular',
    color: colors.textBlack,
  },
  inputWithIcon: {
    paddingRight: scale(45), 
  },
  eyeIconContainer: {
    position: 'absolute',
    right: scale(15),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  }
});