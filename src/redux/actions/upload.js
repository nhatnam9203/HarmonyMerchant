import apiConfigs from '../../configs/api';

export function uploadAvatar(files) {
    return {
        type: 'UPLOAD_AVATAR',
        method: 'POST',
        media: files,
        api: `${apiConfigs.BASE_API}file?category=avatar`
    }
}

export function resetStateUpload(){
    return{
        type:'RESET_STATE_UPLOAD'
    }
}

export function uploadBanner(files,infoBanner,merchantId) {
    return {
        type: 'UPLOAD_BANNER',
        method: 'POST',
        media: files,
        api: `${apiConfigs.BASE_API}file?category=avatar`,
        infoBanner,
        merchantId
    }
}