import { StarPRNT } from 'react-native-star-prnt';

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

        try {
            // StarGraphic,
            // StarPRNT
            // StarLine
            let printResult = await StarPRNT.print('StarPRNT', commands, portName);
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
            console.log('portName : ', portName);
            // console.log('commands : ', commands);

            let printResult = await StarPRNT.print('StarPRNT', commands, portName);
            console.log(printResult); // Success!
        } catch (error) {
            console.log('error : ', error);
        }
        // return StarPRNT.print('StarGraphic', commands, portName);
    }


    async checkStatus(portName) {
        // StarGraphic,
        // StarPRNT
        // StarLine
        try {
            let printResult = await StarPRNT.checkStatus(portName, 'StarPRNT');
            console.log(printResult); // Success!
        } catch (error) {
            console.log('error : ', error);
        }
        // return StarPRNT.print('StarGraphic', commands, portName);
    }




}