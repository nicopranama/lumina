import { StyleSheet, Text, TextStyle, View } from 'react-native';
import React from 'react';
import { colors } from '../constants/theme';
import { TypoProps } from '../types';
import { moderateScale } from '../utils/styling';
import { useDisplayFont } from '../hooks/useFont';

const Typo = ({
    size,
    color = colors.textBlack,
    children,
    style,
    textProps = {},
    fontWeight,
    fontFamily = 'Sf-Medium',
}: TypoProps) => {
    const [fontsLoaded] = useDisplayFont();
    const textStyle: TextStyle = {
        fontSize: size ? moderateScale(size) : moderateScale(18),
        color,
        fontFamily,
        fontWeight,
    };

    return (
        <Text style={[textStyle, style]} {...textProps}>
            {children}
        </Text>
    );
};

export default Typo;