import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class BusinessInfoScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            businessInfo: {
                question1: {
                    isAccept: false,
                    desc: '',
                    question:'question1'
                },
                question2: {
                    isAccept: false,
                    desc: '',
                    question:'question2'
                },
                question3: {
                    isAccept: false,
                    desc: '',
                    question:'question3'
                },
                question4: {
                    isAccept: false,
                    desc: '',
                    question:'question4'
                },
                question5: {
                    isAccept: false,
                    desc: '',
                    question:'question5'
                },
            }
        }

    }

    updateBusinessInfo(key, value, keyParent = '') {
        const { businessInfo } = this.state;
        if (keyParent !== '') {
            const temptParent = businessInfo[keyParent];
            const temptChild = { ...temptParent, [key]: value };
            const temptUpdate = { ...businessInfo, [keyParent]: temptChild };
            this.setState({
                businessInfo: temptUpdate
            })
        } else {
            const temptUpdate = { ...businessInfo, [key]: value };
            this.setState({
                businessInfo: temptUpdate
            })
        }
    }

    changeStatusCheck(isCheck, key) {
        if (isCheck) {
            this.updateBusinessInfo('isAccept', true, key);
        } else {
            const { businessInfo } = this.state;
            const temptParent = businessInfo[key];
            const temptChild = { ...temptParent, isAccept: false, desc: '' };
            const temptUpdate = { ...businessInfo, [key]: temptChild };
            this.setState({
                businessInfo: temptUpdate
            })
        }
    }

    nextTab = () => {
        const { businessInfo } = this.state;
        this.props.actions.app.setBusinessInfo(businessInfo);
        this.props.navigation.navigate('BankInfo');
    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language
})



export default connectRedux(mapStateToProps, BusinessInfoScreen);