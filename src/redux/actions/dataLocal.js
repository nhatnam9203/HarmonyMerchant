export function updateProfile(profile) {
    return {
        type: 'UPDATE_PROFILE_SOCKET',
        payload: profile
    }
}

export function clearProfileLocal() {
    return {
        type: 'CLEAR_PROFILE_LOCAL',
        payload: {}
    }
}

export function saveTokenFCM(payload) {
    return {
        type: 'SAVE_TOKEN_FCM',
        payload
    }
}

export function changeSettingLocal(language, autoCloseAt) {
    return {
        type: 'CHANGE_SETTING_LOCAL_APP',
        payload: {
            language: language,
            // autoLockScreenAfter: autoLockScreenAfter,
            autoCloseAt: autoCloseAt
        }
    }
}


export function setupPaxMachine(paxInfo) {
    return {
        type: 'SETUP_PAX_MACHINE',
        payload: paxInfo
    }
}

export function resetStateLoginStaff(flag = false) {
    return {
        type: 'RESET_STATE_LOGIN_STAFF',
        payload: flag
    }
}

export function resetStateLoginStaffReportServer(flag = false) {
    return {
      type: "RESET_STATE_LOGIN_STAFF_REPORT_SERVER",
      payload: flag,
    };
  }

export function resetNeddSettingStore() {
    return {
        type: 'RESET_NEED_SETTING_STORE',
    }
}

export function addAppointmentOfflineMode(body) {
    return {
        type: 'ADD_APPOINTMENT_OFFLINE_MODE',
        payload: body
    }
}

export function updateBusinessHour(data) {
    return {
        type: 'UPDATE_BUSSINES_HOUR',
        payload: data
    }
}

export function updateDeviceId(uniqueId) {
    return {
        type: 'UPDATE_DEVICE_ID',
        payload: uniqueId
    }
}

export function updateDeviceName(deviceName) {
    return {
        type: 'UPDATE_DEVICE_NAME',
        payload: deviceName
    }
}


export function updateVersionApp(version) {
    return {
        type: 'UPDATE_VERSION_APP',
        payload: version
    }
}

export function deleteHardware() {
    return {
        type: 'DELETE_HARDWARE',
    }
}

export function toggleSaveMID(status = true) {
    return {
        type: 'TOGGLE_SAVE_MID',
        payload: status
    }
}

export function updateAutoLockTime(value) {
    return {
        type: 'UPDATE_AUTO_LOCK_TIME',
        payload: value
    }
}

export function updatePrinterList(printers) {
    return {
        type: 'UPDATE_PRINTER_LIST',
        payload: printers
    }
}

export function updatePrinterPortType(type) {
    return {
        type: 'UPDATE_PRINTER_PORT_TYPE',
        payload: type
    }
}

export function selectPrinter(printer) {
    return {
        type: 'SELECT_PRINTER',
        payload: printer
    }
}

export function switchTipOnPaxMachine(toggle = true) {
    return {
        type: 'SWITCH_TIP_ON_PAX_MACHINE',
        payload: toggle
    }
}

export function saveBluetoothPaxInfo(peripheral) {
    return {
        type: 'SAVE_BLUETOOTH_PAX_INFO',
        payload: peripheral
    }
}