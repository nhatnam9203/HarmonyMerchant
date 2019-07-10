import apiConfigs from '../../configs/api';

export function uploadAvatar(files) {
    return {
        type: 'UPLOAD_AVATAR',
        method: 'POST',
        media: files,
        api: `${apiConfigs.BASE_API}file?category=avatar`
    }
}

export function getAppointmentById(id) {
    return {
        type: 'GET_APPOINTMENT_BY_ID',
        method: 'GET',
        api: `${apiConfigs.BASE_API}appointment/${id}`,
        token:true
    }
}