export function setupPaxMachine(paxInfo) {
    return {
        type: 'SETUP_PAX_MACHINE',
        payload: paxInfo
    }
}

export function setVisiblePopupPairingCode(isVisible) {
    return {
        type: 'SET_VISIBLE_POPUP_PAIRING_CODE',
        isVisible,
    }
}

export function setPairingCode(pairingCode) {
    return {
        type: 'SET_PAIRING_CODE',
        pairingCode,
    }
}

