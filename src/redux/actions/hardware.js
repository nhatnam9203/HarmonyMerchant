export function setupPaxMachine(paxInfo) {
    return {
        type: 'SETUP_PAX_MACHINE',
        payload: paxInfo
    }
}

export function setupCloverMachine(cloverInfo) {
    return {
        type: 'SETUP_CLOVER_MACHINE',
        payload: cloverInfo
    }
}

export function setCloverToken(token) {
    return {
        type: 'SET_CLOVER_TOKEN',
        payload: token
    }
}

export function setupDejavooMachine(dejavooInfo) {
    return {
        type: 'SETUP_DEJAVOO_MACHINE',
        payload: dejavooInfo
    }
}

export function setDejavooMachineSN(sn) {
    return {
        type: 'SET_DEJAVOO_SN',
        payload: sn
    }
}