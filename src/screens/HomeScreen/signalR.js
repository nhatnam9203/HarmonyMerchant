require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
const signalR = require("@aspnet/signalr");
//import { HubConnection } from 'signalr-client-react';
import axios from 'axios'
let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      bookingMessage: '',
      messages: [],
      bookingHubConnection: null
    };
  }

  componentDidMount = () => {
    var connection = new signalR.HubConnectionBuilder()
      .withUrl("https://api2.levincidemo.com/notification/?merchantId=3&Title=Merchant&type=appointment_update", { accessTokenFactory: () => "111" })
      .build();
    connection.on("ListWaNotification", (json) => {
      const text = `Json: ${json} `;
      //- payload:  ${token}
      const messages = this.state.messages.concat([text]);
      // console.log(text);
    });

    connection.start().catch(function (err) {
      // console.log("Error on Start : ", err);
    });
  };


  render() {
    return (
      <div className="index">
        <img src={yeomanImage} alt="Yeoman Generator" />
        <div className="notice">Message from server - {this.state.bookingMessage}</div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;