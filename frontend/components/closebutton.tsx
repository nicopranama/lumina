import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { CloseButtonProps } from '../types';
import { useRouter } from 'expo-router';
import { moderateScale } from '../utils/styling';
import { colors } from '../constants/theme';
import { X } from 'phosphor-react-native'

const CloseButton = ({ style, iconSize = 15 }: CloseButtonProps) => {
    const router = useRouter();
    return (
        <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.button, style]}
        >
            <X
                size = {moderateScale(iconSize)}
                color = {colors.black}
                weight = "bold"
            />
        </TouchableOpacity>
    );
};

export default CloseButton

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.white,
        alignSelf: "flex-start",
    },
});