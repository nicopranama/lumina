import { useRouter } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import RegisterForm from '../../components/auth/registerform';
import ScreenWrapper from '../../components/myscreenwrapper';
import Typo from '../../components/typography';
import { AUTH_ERRORS } from '../../constants/auth';
import { colors } from '../../constants/theme';
import { useAuth } from '../../context/authcontext';
import { moderateScale, scale, verticalScale } from '../../utils/styling';

export default function SignUp() {
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (username: string, email: string, password: string) => {
    if (!username || !email || !password) {
      setError(AUTH_ERRORS.EMPTY_FIELDS);
      return;
    }
    
    if (password.length < 6) {
      setError(AUTH_ERRORS.PASSWORD_LENGTH);
      return;
    }
    
    setLoading(true);
    try {
      const result = await register(username, email, password);
      if (result.success) {
        console.log('Registration successful!...');
      } else {
        setError(result.msg || 'Registration failed');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToLogin = () => {
    setError('');
    router.replace('/auth/signin');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
            <CaretLeft weight="bold" size={moderateScale(25)} color={colors.black} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Typo style={styles.titleText}>
              Begin your{'\n'}journey to{'\n'}healthier skin
            </Typo>
          </View>
          
          <View style={styles.formContainer}>
            <RegisterForm 
              error={error}
              onRegister={handleRegister}
              onSwitchMode={handleSwitchToLogin}
              initialValues={{ name: '', email: '', password: '' }}
            />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  header: {
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(5),
  },
  backButton: {
    alignSelf: 'flex-start',
    // padding: scale(5),
  },
  contentContainer: {
    flex: 1,
    paddingTop: verticalScale(20),
    paddingHorizontal: scale(5),
  },
  titleContainer: {
    marginBottom: verticalScale(20),
  },
  titleText: {
    fontSize: moderateScale(40),
    fontFamily: 'Sf-Medium',
    color: colors.textBlack,
    // lineHeight: moderateScale(38),
  },
  formContainer: {
    width: '100%',
  },
});