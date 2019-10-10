import _ from 'ramda';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class ReportScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isFocus: true,
            valueSwitch: true
        }
    }

    componentDidMount() {
        this.props.actions.staff.getListStaffsSalaryTop();
        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
                this.setState({
                    isFocus: false
                })
            }
        );
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.setState({
                    isFocus: true
                })
            }
        );
    }

    handleLockScreen = () => {
        const { isFocus } = this.state;
        if (isFocus) {
            this.props.navigation.navigate('Home');
            this.props.actions.app.changeFlagVisibleEnteerPinCode(true);
        }
    }

    openDrawer = () => {
        this.props.navigation.openDrawer();
    }

    onValueChangeSwich = (value) =>{
      this.setState({
          valueSwitch: value
      })
    }
 
    componentWillUnmount() {
        this.didBlurSubscription.remove();
        this.didFocusSubscription.remove();
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    listStaffsSalary: state.staff.listStaffsSalary
})



export default connectRedux(mapStateToProps, ReportScreen);