import React from "react";
import {
    Dimensions,
    Platform,
    StatusBar,
    StyleSheet,
    View
} from "react-native";
import { colors } from "../constants/theme";
import { ScreenWrapperProps } from "../types";

const { height } = Dimensions.get("window");

const ScreenWrapper = ({ style, children } : ScreenWrapperProps) => {
    let paddingTop = Platform.OS == "ios" ? height * 0.06 : 20;
    let paddingBottom = Platform.OS == "ios" ? height * 0.02 : 10;
    return (
        <View
            style={[
                {
                    paddingTop,
                    paddingBottom,
                    flex: 1,
                    backgroundColor: colors.white,
                },
                style,
            ]}
        >
            <StatusBar 
                backgroundColor={colors.white}
                barStyle = "dark-content" />
            {children}
        </View>
    );
};

export default ScreenWrapper;

const styles = StyleSheet.create({});