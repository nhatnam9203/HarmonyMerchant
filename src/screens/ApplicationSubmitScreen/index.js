import React from 'react';

import Layout from './layout';
import connectRedux from '../../redux/ConnectRedux';

class ApplicationSubmitScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }

    }

    submit1 = () =>{
        this.props.navigation.navigate('GeneralInfo');
    }

    submit = () => {
        const body = {
            "generalInfo": {
                "businessName": "Test bussines",
                "doingBusiness": "Nail",
                "tax": "abc-123456",
                "businessAddress": {
                    "address": "address",
                    "city": "1",
                    "state": "1",
                    "zip": "12345"
                },
                "businessPhone": "12312312300",
                "email": "phi1@gmail.com",
                "firstName": "First Name",
                "lastName": "Last Name",
                "position": "1",
                "contactPhone": "1231231111"
            },
            "businessInfo": {
                "question1": {
                    "isAccept": false,
                    "desc": "abc"
                },
                "question2": {
                    "isAccept": false,
                    "desc": "aiss"
                },
                "question3": {
                    "isAccept": false,
                    "desc": "aaaa"
                },
                "question4": {
                    "isAccept": false,
                    "desc": "asd"
                },
                "question5": {
                    "isAccept": false,
                    "desc": "asdasd"
                }
            },
            "bankInfo": {
                "bankName": "Master Bank",
                "routingNumber": "abc",
                "accountNumber": "12312662432100"
            },
            "principalInfo": {
                "firstName": "P First Name",
                "lastName": "L Last Name",
                "position": "Admin",
                "ownership": "NONE",
                "homePhone": "019238123",
                "mobilePhone": "12321312312312",
                "address": {
                    "address": "P Address",
                    "city": "2",
                    "state": "2",
                    "zip": "123123"
                },
                "yearAtThisAddress": "2019",
                "ssn": "123",
                "dateOfBirth": "12/12/1993",
                "email": "ptest@gmail.com",
                "driverLicense": "123",
                "stateIssued": "123"
            }
        };
        this.props.actions.app.registerUser(body);
    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, ApplicationSubmitScreen);