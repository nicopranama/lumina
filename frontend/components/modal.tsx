import { verticalScale } from '@/utils/styling';
import React from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Modal as RNModal,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PROPS } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const Modal = ({ 
    isOpen, 
    withInput, 
    position = 'center',
    onClose,
    children, 
    ...rest 
}: PROPS & { position?: 'center' | 'bottom' }) => {
    const insets = useSafeAreaInsets();
    const renderContent = () => {
        if (position === 'bottom') {
            return (
                <KeyboardAvoidingView 
                    style={styles.bottomModalContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <TouchableWithoutFeedback onPress={onClose}>
                        <View style={styles.backdrop} />
                    </TouchableWithoutFeedback>
                    <View style={[styles.bottomModalWrapper, { paddingBottom: Math.max(insets.bottom, 5) }]}>
                        <View style={styles.bottomContent}>
                            {children}
                        </View>
                    </View>
                </KeyboardAvoidingView>
            );
        }
        
        if (withInput) {
            return (
                <KeyboardAvoidingView
                    style={styles.keyboardAvoidingView}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <TouchableWithoutFeedback onPress={onClose}>
                        <View style={styles.backdrop} />
                    </TouchableWithoutFeedback>
                    <View style={styles.centeredModalWrapper}>
                        <View style={styles.centeredContent}>
                            {children}
                        </View>
                    </View>
                </KeyboardAvoidingView>
            );
        }
        
        return (
            <View style={styles.centeredView}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>
                <View style={styles.centeredModalWrapper}>
                    <View style={styles.centeredContent}>
                        {children}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <RNModal
            visible={isOpen}
            transparent
            animationType='fade'
            statusBarTranslucent
            onRequestClose={onClose}
            {...rest}
        >
            {renderContent()}
        </RNModal>
    );
};

export default Modal;

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(24, 24, 27, 0.4)',
    },
    bottomModalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: Platform.OS === 'ios' ? 15 : 15,
    },
    bottomModalWrapper: {
        paddingHorizontal: 10, 
    },
    bottomContent: {
        backgroundColor: 'white',
        borderRadius: 24,
        width: '100%',
        maxHeight: SCREEN_HEIGHT * 0.9,
        overflow: 'hidden',
        paddingTop: verticalScale(20), 
        paddingBottom: Platform.OS === 'ios' ? 34 : 20, 
    },
    centeredModalWrapper: {
        paddingHorizontal: 10,
    },
    centeredContent: {
        backgroundColor: 'white',
        borderRadius: 24,
        width: '100%',
        maxHeight: SCREEN_HEIGHT * 0.85,
        overflow: 'hidden',
        paddingTop: verticalScale(20),
    },
});