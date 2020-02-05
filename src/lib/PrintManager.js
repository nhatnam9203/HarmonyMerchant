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

    portDiscovery() {
        return Promise.race([
            StarPRNT.portDiscovery('Bluetooth'),
            new Promise((_, reject) =>
                setTimeout(() => reject('BlueToothTimeOut'), 5000)
            )
        ])
    }

    async  openCashDrawer(portName) {
        let commands = [];
        commands.push({
            openCashDrawer: 1
        });

        console.log('portName : ', portName);
        try {
            // StarGraphic,
            // StarPRNT
            // StarLine
            let printResult = await StarPRNT.print( PRINTER_MACHINE[portName].emulation, commands, portName);
            //console.log(printResult); // Success!
        } catch (e) {
            console.error(e);
        }
    }

    async print(portName, commands) {
        // StarGraphic,
        // StarPRNT
        // StarLine
        try {

            let printResult = await StarPRNT.print(PRINTER_MACHINE[portName].emulation, commands, portName);
            console.log(printResult); // Success!
        } catch (error) {
            console.log('error : ', error);
        }
    }


    async checkStatus(portName) {
        try {
            let printResult = await StarPRNT.checkStatus(portName, PRINTER_MACHINE[portName].emulation);
            // console.log(printResult); // Success!
        } catch (error) {
            // console.log('error : ', error);
        }
    }

    async connect(portName,hasBarcodeReader = false) {
        try {
            let connect = await StarPRNT.connect(portName,PRINTER_MACHINE[portName].emulation, hasBarcodeReader);
            console.log('connect : ',connect); // Success!
        } catch (error) {
            console.log('error : ', error);
        }
    }



}