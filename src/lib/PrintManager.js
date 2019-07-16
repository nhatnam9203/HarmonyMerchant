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
            var printResult = await StarPRNT.print('StarPRNT', commands, portName);
            console.log(printResult); // Success!
        } catch (e) {
            console.error(e);
        }
    }

    async print(portName,commands) {
        try {
            var printResult = await StarPRNT.print('StarPRNT', commands, portName);
            console.log(printResult); // Success!
        } catch (e) {
            console.error(e);
        }
    }

}