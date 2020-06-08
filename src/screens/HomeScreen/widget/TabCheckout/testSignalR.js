setupSignalR(profile, token, checkoutGroupId, deviceId) {
    try {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${apiConfigs.BASE_URL}notification/?merchantId=${profile.merchantId}&Title=Merchant&kind=app&deviceId=${deviceId}&token=${token}`,
                {
                    transport: signalR.HttpTransportType.LongPolling | signalR.HttpTransportType.WebSockets
                })
            .configureLogging(signalR.LogLevel.Information)
            .build();

        connection.on("ListWaNotification", (data) => {
            const temptData = JSON.parse(data);
            if (temptData.data && !_.isEmpty(temptData.data) && temptData.data.isPaymentHarmony
                && temptData.data.checkoutGroupId == checkoutGroupId
            ) {
                this.handleHarmonyPayment(temptData.data.checkoutPayment);
                connection.stop();
            }
            // ---------- Handle reload Tip in Customer App ---------
            if (temptData.data && !_.isEmpty(temptData.data) && temptData.data.isTipAppointment) {
                this.props.actions.appointment.getGroupAppointmentById(temptData.data.appointmentId);
            }
        });

        connection.onclose(async (error) => {
            console.log("------ SignalR onclose ");
            this.props.actions.appointment.resetConnectSignalR();
            // connection.start();
        });


        connection.start()
            .then(() => {
                console.log("------ SignalR start ");
                this.props.actions.appointment.referenceConnectionSignalR(connection)
            })
            .catch(error => {
                console.log("------ SignalR error :  ", error);
                connection.start()
            });

    } catch (error) {
        console.log('------ error : ', error);
        connection.start()
    }
}