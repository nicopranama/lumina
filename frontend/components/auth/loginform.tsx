import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants/theme';
import { useForm } from '../../hooks/useForm';
import { LoginFormData, LoginFormProps } from '../../types';
import { moderateScale, verticalScale } from '../../utils/styling';
import Button from '../button';
import Typo from '../typography';
import AuthInput from './authinput';
import ErrorMessage from './errormessage';

const LoginForm: React.FC<LoginFormProps> = ({ 
    error, 
    onLogin, 
    onSwitchMode,
    initialValues = { email: '', password: ''} 
}) => {
  const [form, handleChange] = useForm<LoginFormData>(initialValues);

  const handleSubmit = () => {
    onLogin(form.email, form.password);
  };

  return (
    <View style={styles.formContainer}>
      
      <ErrorMessage message={error} />
      
      <AuthInput
        value={form.email}
        onChangeText={handleChange('email')}
        placeholder="Enter email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <AuthInput
        value={form.password}
        onChangeText={handleChange('password')}
        placeholder="Enter password"
        secureTextEntry
      />
      
      <Button style={styles.button} onPress={handleSubmit}>
        <Typo style={styles.buttonText}>Sign In</Typo>
      </Button>
      
      <View style={styles.switchContainer}>
        <Typo style={styles.switchText}>Don't have an account? </Typo>
        <TouchableOpacity onPress={onSwitchMode}>
          <Typo style={styles.switchButtonText}>Sign Up</Typo>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
    formContainer: {
      width: '100%',
      alignItems: 'center',
      paddingTop: verticalScale(10),
    },
    button: {
      width: '100%',
      height: verticalScale(60),
      backgroundColor: colors.black,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      marginTop: verticalScale(10),
    },
    buttonText: {
      color: colors.white,
      fontSize: moderateScale(16),
      fontFamily: 'Sf-Medium',
    },
    switchContainer: {
      flexDirection: 'row',
      marginTop: verticalScale(20),
    },
    switchText: {
      color: colors.textLightGrey,
      fontSize: moderateScale(14),
      fontFamily: 'Sf-Regular',
    },
    switchButtonText: {
      color: colors.textBlack,
      fontSize: moderateScale(14),
      fontFamily: 'Sf-Medium',
    },
});