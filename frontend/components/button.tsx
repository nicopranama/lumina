import { StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native'
import React from 'react'
import { CustomButtonProps } from '../types';
import { colors, radius } from '../constants/theme';
import { scale, verticalScale } from '../utils/styling';
import Loading from './loading';

const Button = ({
    style,
    onPress,
    loading = false,
    children
}: CustomButtonProps) => {
    if(loading) {
        return (
            <View style={[styles.button, style, {backgroundColor: 'transparent'}]}>
                <Loading/>
            </View>
        )
    }
  return (
    <Pressable 
        onPress={onPress} 
        style={({pressed}) => [
            styles.button,
            style,
            pressed && {opacity: 0.8}
        ]}
    >
        {children}
    </Pressable>
  );
};

export default Button

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primaryDark,
        borderRadius: radius._10,
        borderCurve: "continuous",
        width: scale(300),
        height: verticalScale(60),
        justifyContent: 'center',
        alignItems: 'center',
    }
});