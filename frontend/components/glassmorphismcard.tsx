import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { scale, verticalScale, moderateScale } from '../utils/styling';
import { colors } from '../constants/theme';
import { GlassmorphismCardProps } from '@/types';

const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
  children,
  style,
  intensity = 68,
  tintColor = '#959595',
  tintOpacity = 0.25,
}) => {
  return (
    <View style={[styles.container, style]}>
      <BlurView
        intensity={intensity}
        tint="light"
        style={styles.blurContainer}
      >
        <View style={[
          styles.colorOverlay,
          { backgroundColor: tintColor, opacity: tintOpacity }
        ]} />
        <View style={styles.content}>
          {children}
        </View>
      </BlurView>
    </View>
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
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default GlassmorphismCard;