import {
    Platform,
    Dimensions,
    Linking
} from 'react-native';

import Configs from '../configs';
import Localization from '../localization';

const { width } = Dimensions.get('window');

export const hiddenTabbar = stack => {
    stack.navigationOptions = ({ navigation }) => {
        let tabBarVisible = true;
        if (navigation.state.index > 0) {
            tabBarVisible = false;
        }
        return {
            tabBarVisible,
        };
    };
}

export const isPlatformIOS = _ => {
    return Platform.OS === 'ios';
}

export const scaleSzie = size => {
    return width * size / Configs.DEFAULT_WIDTH;
}

export const requestAPI = async (action, headers = {}) => {

    let method = action.method || 'GET';
    let request = {
        method: method,
        headers: Object.assign({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, headers)
    };
    if (action.token) {
        request.headers['Authorization'] = "Bearer " + action.token;
    }
    if (action.email) {
        request.headers['email'] = action.email;
    }
    if ((method == "POST" || method == "DELETE" || method == "PUT") && action.body) {
        console.log('body -- :' +JSON.stringify(action.body));
        request['body'] = JSON.stringify(action.body);
    }
    let response = await fetch(action.api, request);
    const data = await response.json();
    console.log('data : ',data);
    return { ...data, statusCode: response.status };
}

export const isIphoneX = () => {
    const { height, width } = Dimensions.get('window');
    return (Platform.OS === 'ios' && (height === 812 || width === 812)
    );
}

export const validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const openBrowser = (urlSocial) => {
    Linking.canOpenURL(urlSocial).then(supported => {
        if (!supported) {
        } else {
            return Linking.openURL(urlSocial);
        }
    }).catch(err => console.error('An error occurred', err));
}

export const validateIsNumber = (number) => {
    var n = Number(number);
    return !(n !== n);
}

export const localize = (value, lang = 'en') => {
    const temptValue = Localization[lang][value];
    return temptValue ? `${Localization[lang][value]}` : `${value}`
};

export const WorkingTime = [
    {
        value:'00:00 AM',
    },
    {
        value:'00:30 AM',
    },
    {
        value:'01:00 AM',
    },
    {
        value:'01:30 AM',
    },
    {
        value:'02:00 AM',
    },
    {
        value:'02:30 AM',
    },
    {
        value:'03:00 AM',
    },
    {
        value:'03:30 AM',
    },
    {
        value:'04:00 AM',
    },
    {
        value:'04:30 AM',
    },
    {
        value:'05:00 AM',
    },
    {
        value:'05:30 AM',
    },
    {
        value:'06:00 AM',
    },
    {
        value:'06:30 AM',
    },
    {
        value:'07:00 AM',
    },
    {
        value:'07:30 AM',
    },
    {
        value:'08:00 AM',
    },
    {
        value:'08:30 AM',
    },
    {
        value:'09:00 AM',
    },
    {
        value:'10:00 AM',
    },
    {
        value:'10:30 AM',
    },
    {
        value:'11:00 AM',
    },
    {
        value:'11:30 AM',
    },
    {
        value:'12:00 AM',
    },
    {
        value:'12:30 AM',
    },
    {
        value:'01:00 PM',
    },
    {
        value:'01:30 PM',
    },
    {
        value:'02:00 PM',
    },
    {
        value:'02:30 PM',
    },
    {
        value:'03:00 PM',
    },
    {
        value:'03:30 PM',
    },
    {
        value:'04:00 PM',
    },
    {
        value:'04:30 PM',
    },
    {
        value:'05:00 PM',
    },
    {
        value:'05:30 PM',
    },
    {
        value:'06:00 PM',
    },
    {
        value:'06:300 PM',
    },
    {
        value:'07:00 PM',
    },
    {
        value:'07:30 PM',
    },
    {
        value:'08:00 PM',
    },
    {
        value:'08:30 PM',
    },
    {
        value:'09:00 PM',
    },
    {
        value:'10:00 PM',
    },
    {
        value:'10:30 PM',
    },
    {
        value:'11:00 PM',
    },
    {
        value:'11:30 PM',
    },
    {
        value:'12:00 PM',
    },
    {
        value:'12:30 PM',
    },
]

export const Roles = [
    {
        value:'Admin'
    },
    {
        value:'Staff'
    }
]

export const Status = [
    {
        value :'Active'
    },
    {
        value:'Disable'
    }
]