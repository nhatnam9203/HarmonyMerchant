import Layout from './layout';
import connectRedux from '../../redux/ConnectRedux';

class BusinessInfoScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            businessInfo: {
                question1: {
                    isAccept: false,
                    desc: ''
                },
                question2: {
                    isAccept: false,
                    desc: ''
                },
                question3: {
                    isAccept: false,
                    desc: ''
                },
                question4: {
                    isAccept: false,
                    desc: ''
                },
                question5: {
                    isAccept: false,
                    desc: ''
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

    nextTab =() =>{
        const{businessInfo} = this.state;

        console.log('businessInfo : ',businessInfo);
    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, BusinessInfoScreen);