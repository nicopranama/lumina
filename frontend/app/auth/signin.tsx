import { useRouter } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import LoginForm from '../../components/auth/loginform';
import ScreenWrapper from '../../components/myscreenwrapper';
import Typo from '../../components/typography';
import { AUTH_ERRORS } from '../../constants/auth';
import { colors } from '../../constants/theme';
import { useAuth } from '../../context/authcontext';
import { moderateScale, scale, verticalScale } from '../../utils/styling';

export default function SignIn() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) {
      setError(AUTH_ERRORS.EMPTY_FIELDS);
      return;
    }
    
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        console.log('Login successful! Navigating to main app...');
      } else {
        setError(result.msg || 'Login failed');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToRegister = () => {
    setError('');
    router.replace('/auth/signup');
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
              Back to where{'\n'}your glow{'\n'}begins.
            </Typo>
          </View>
          
          <View style={styles.formContainer}>
            <LoginForm 
              error={error}
              onLogin={handleLogin}
              onSwitchMode={handleSwitchToRegister}
              initialValues={{ email: '', password: '' }}
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