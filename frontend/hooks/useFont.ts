import { useFonts } from 'expo-font';

export const useDisplayFont = () => {
    return useFonts({
        'Sf-Regular': require('../assets/fonts/sfprodisplayregular.otf'),
        'Sf-Medium': require('../assets/fonts/sfprodisplaymedium.otf'),
        'Sf-Bold': require('../assets/fonts/sfprodisplaybold.otf'),
    });
};