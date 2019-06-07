import ImagePicker from 'react-native-image-picker';

import Layout from './layout';
import connectRedux from '../../redux/ConnectRedux';

class PrincipalScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            principalInfo: {
                firstName: '',
                lastName: '',
                position: '',
                ownership: '',
                homePhone: '',
                mobilePhone: '',
                addressPrincipal: {
                    address: '',
                    city: '',
                    state: '',
                    zip: ''
                },
                yearAtThisAddress: "",
                ssn: '',
                dateOfBirth: '',
                email: '',
                driverLicense: '',
                stateIssued: ''
            },
        }
    }

    updatePrincipalInfo(key, value, keyParent = '') {
        const { principalInfo } = this.state;
        if (keyParent !== '') {
            const temptParent = principalInfo[keyParent];
            const temptChild = { ...temptParent, [key]: value };
            const temptUpdate = { ...principalInfo, [keyParent]: temptChild };
            this.setState({
                principalInfo: temptUpdate
            })
        } else {
            const temptUpdate = { ...principalInfo, [key]: value };
            this.setState({
                principalInfo: temptUpdate
            })
        }
    }

    nextScreen = () => {
        const { principalInfo } = this.state;
        console.log('principalInfo : ', principalInfo);
    }

    takePhoto = () => {
        ImagePicker.launchCamera({}, (response) => {
            if (response.uri){

            }
          });
    }

    openImageLibrary =() =>{
        ImagePicker.launchImageLibrary({}, (response) => {
            if (response.uri){
                console.log(response.uri);
            }
          });
    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, PrincipalScreen);