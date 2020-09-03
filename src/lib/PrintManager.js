import { StarPRNT } from 'react-native-star-prnt';

import {
    PRINTER_MACHINE
} from '@utils';

let instance;

export default class PrintManager {
    static getInstance() {
        if (!instance) {
            return new PrintManager();
        }
        return instance;
    }

    portDiscovery(portType = "Bluetooth") {
        return Promise.race([
            StarPRNT.portDiscovery(portType),
            new Promise((_, reject) =>
                setTimeout(() => reject('Timeout'), 15000)
            )
        ])
    }

    async openCashDrawer(portName) {
        let commands = [];
        commands.push({
            openCashDrawer: 1
        });

        // console.log('portName : ', portName);
        try {
            // StarGraphic,
            // StarPRNT
            // StarLine
            let printResult = await StarPRNT.print(PRINTER_MACHINE[portName].emulation, commands, portName);
            //console.log(printResult); // Success!
        } catch (e) {
            console.error(e);
        }
    }

    async print(emulation, commands, portName) {
        // StarGraphic,
        // StarPRNT
        // StarLine
        try {

            let printResult = await StarPRNT.print(emulation, commands, portName);
            // console.log(printResult); // Success!
        } catch (error) {
            // console.log('error : ', error);
        }
    }


    async checkStatus(portName, emulation) {
        try {
            let status = await StarPRNT.checkStatus(portName, emulation);
            // console.log("---- checkStatus: ",status);
            // console.log(printResult); // Success!
            return status
        } catch (error) {
            // console.log('error : ', error);
            throw error;
        }
    }

    async connect(portName, hasBarcodeReader = false) {
        try {
            let connect = await StarPRNT.connect(portName, PRINTER_MACHINE[portName].emulation, hasBarcodeReader);
            // console.log('connect : ',connect); // Success!
            return connect;
        } catch (error) {
            // console.log('error : ', error);
        }
    }



}