import { Dimensions, Platform } from 'react-native';

const configs = {
    VERSION: "1.0.0",
    DEFAULT_WIDTH: Platform.OS === 'ios' ? 768 : 900,
    // DEFAULT_WIDTH: 736, mobile
    DEFAULT_HEIGHT: 736,
    FULL_WIDTH: Dimensions.get('window').width,
    // app's color 
    ORANGE: "rgb(249,115,0)",
    COLOR_MAIN_APP: "rgba(51,73,131,0.6)",
    SHADOW: {
        ...Platform.select({
            ios: {
                shadowRadius: 2,
                shadowColor: 'rgba(0, 0, 0, 1.0)',
                shadowOpacity: 0.54,
                shadowOffset: { width: 0, height: 2 },
            },

            android: {
                elevation: 2,
            },
        })
    }
}

export default configs; 