import Layout from './layout';
import connectRedux from '../../redux/ConnectRedux';

class PrincipalScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            principalInfo:{
                firstName:'',
                lastName:'',
                position :'',
                ownership:'',
                homePhone:'',
                mobilePhone:'',
                address:{
                    address:'',
                    city:'',
                    state:'',
                    zip:''
                },
                yearAtThisAddress:"",
                ssn :'',
                dateOfBirth:'',
                email:'',
                driverLicense:'',
                stateIssued:''
            },
        }

    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, PrincipalScreen);