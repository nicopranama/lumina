import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants/theme';
import { useForm } from '../../hooks/useForm';
import { RegisterFormData, RegisterFormProps } from '../../types';
import { moderateScale, verticalScale } from '../../utils/styling';
import Button from '../button';
import Typo from '../typography';
import AuthInput from './authinput';
import ErrorMessage from './errormessage';

const RegisterForm: React.FC<RegisterFormProps> = ({ 
    error, 
    onRegister, 
    onSwitchMode,
    initialValues = { name: '', email: '', password: '' } 
}) => {
  const [form, handleChange] = useForm<RegisterFormData>(initialValues);

  const handleSubmit = () => {
    onRegister(form.name, form.email, form.password);
  };

  return (
    <View style={styles.formContainer}>
      
      <ErrorMessage message={error} />
      
      <AuthInput
        value={form.name}
        onChangeText={handleChange('name')}
        placeholder="Enter username"
      />
      
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
        <Typo style={styles.buttonText}>Create Account</Typo>
      </Button>
      
      <View style={styles.switchContainer}>
        <Typo style={styles.switchText}>Already have an account? </Typo>
        <TouchableOpacity onPress={onSwitchMode}>
          <Typo style={styles.switchButtonText}>Sign In</Typo>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterForm;

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
