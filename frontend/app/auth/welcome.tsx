import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Button from "../../components/button";
import ScreenWrapper from "../../components/myscreenwrapper";
import Typo from "../../components/typography";
import { colors, spacingX } from '../../constants/theme';
import { moderateScale, scale, verticalScale } from '../../utils/styling';

export default function Welcome() {
    const navigation = useNavigation();
    const router = useRouter();

    const handleGetStarted = () => {
        console.log('Navigating to sign up page...');
        router.push('/auth/signup');
    };

    const handleAuthSuccess = () => {
        console.log('Authentication successful! Navigating to main app...');
        router.replace('/main');
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Typo style={styles.headerText}>
                        Reveal Your Best Skin
                    </Typo>
                </View>
                <View style={styles.imageContainer}>
                    <Image 
                        source={require('../../assets/images/GetStartedLumina.jpg')} 
                        style={styles.image} 
                        resizeMode="contain" 
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button onPress={handleGetStarted}>
                        <Typo style={styles.buttonText}>Get Started</Typo>
                    </Button>
                </View>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        width: '100%',
        paddingHorizontal: scale(40),
        paddingVertical: verticalScale(50),
        zIndex: 1,
    },
    headerText: {
        width: '70%',
        fontSize: moderateScale(40),
        color: colors.textBlack,
        fontFamily: 'Sf-Medium',
        textAlign: 'left',
    },
    imageContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    image: {
        width: '90%',
        height: verticalScale(430),
        aspectRatio: 360/430,
        maxWidth: scale(360),
        maxHeight: verticalScale(430),
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: spacingX._10,
        marginBottom: verticalScale(45),
    },
    buttonText: {
        color: colors.white,
        fontSize: moderateScale(16),
        fontFamily: 'Sf-Medium',
    },
});