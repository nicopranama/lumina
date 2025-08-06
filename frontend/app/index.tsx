import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { colors } from '../constants/theme';
import Typo from '../components/typography';

export default function Index () {
  // const router = useRouter();
  // useEffect(() => {
  //   setTimeout(() => {
  //     router.push('/auth/welcome');
  //   }, 2000);
  // }, [])

  return (
    <View style={styles.container}>
      <Typo style={styles.title}>Lumina</Typo>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  title: {
    fontFamily: 'Sf-Medium',
    fontSize: 40,
    color: colors.textBlack,
  },
});
