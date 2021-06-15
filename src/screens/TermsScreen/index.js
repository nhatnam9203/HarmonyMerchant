import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class TermsScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isAgree: false
        }
    }

    componentDidMount(){
        const { stateCity} = this.props;
        if(stateCity.length === 0){
            this.props.actions.app.getStateCity();
        }
    }

    agreeTerm = () => {
        const {isAgreeTerm} = this.props;
        this.props.actions.app.agreeTerm(!isAgreeTerm);
    }

    nextScreen = () => {
        if (this.props.isAgreeTerm) {
            this.props.navigation.navigate('merchant.signup');
        }
    }
}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    isAgreeTerm: state.app.isAgreeTerm,
    language: state.dataLocal.language,
    stateCity : state.dataLocal.stateCity
})



export default connectRedux(mapStateToProps, TermsScreen);