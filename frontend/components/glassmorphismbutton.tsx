import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { scale, verticalScale, moderateScale } from '../utils/styling';
import { colors } from '../constants/theme';
import { GlassmorphismButtonProps } from '@/types';
import Typo from './typography';

const GlassmorphismButton: React.FC<GlassmorphismButtonProps> = ({
  children,
  leftIcon,
  rightIcon,
  text,
  textStyle,
  containerStyle,
  intensity = 68,
  tintColor = '#959595',
  tintOpacity = 0.25,
  glassPadding = 10,
  ...props
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, containerStyle]} 
      activeOpacity={0.8}
      {...props}
    >
      <BlurView
        intensity={intensity}
        tint="light"
        style={styles.blurContainer}
      >
        <View style={[
          styles.colorOverlay,
          { backgroundColor: tintColor, opacity: tintOpacity }
        ]} />
        <View style={[styles.content, { padding: moderateScale(glassPadding) }]}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          
          {text ? (
            <Typo style={[styles.text, textStyle]}>{text}</Typo>
          ) : (
            children
          )}
          
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    width: scale(117),
    height: verticalScale(56),
  },
  blurContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: moderateScale(10),
  },
  content: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  leftIcon: {
    marginRight: scale(8),
  },
  text: {
    color: colors.black,
    fontSize: moderateScale(14),
    fontFamily: 'Sf-Medium',
  },
  rightIcon: {
    marginLeft: scale(8),
  }
});

export default GlassmorphismButton;