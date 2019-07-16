import {

} from 'react-native';
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

    async print(portName) {
        const commandsArray = [];
        commandsArray.push({ appendInternational: StarPRNT.InternationalType.UK });
        commandsArray.push({
            appendLogo: 1,  //Logo number configured using Star Print utility
            logoSize: StarPRNT.LogoSize.Normal
        });
        commandsArray.push({ appendAlignment: StarPRNT.AlignmentPosition.Center });
        commandsArray.push({ append: "Luis Nani \n" });
        commandsArray.push({ appendCutPaper: StarPRNT.CutPaperAction.PartialCutWithFeed });
        try {
            var printResult = await StarPRNT.print('StarPRNT', commandsArray, portName);
            console.log(printResult); // Success!
        } catch (e) {
            console.error(e);
        }
    }

}