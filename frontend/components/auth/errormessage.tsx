import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ErrorMessageProps } from '../../types';
import { moderateScale, scale, verticalScale } from '../../utils/styling';
import Typo from '../typography';

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <View style={styles.errorContainer}>
      <Typo style={styles.errorText}>{message}</Typo>
    </View>
  );
};

export default ErrorMessage;

const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: 'rgba(255, 99, 71, 0.1)',
    padding: scale(10),
    borderRadius: 6,
    width: '100%',
    marginBottom: verticalScale(15),
  },
  errorText: {
    color: 'tomato',
    fontSize: moderateScale(14),
    textAlign: 'center',
    fontFamily: 'Sf-Regular',
  },
});