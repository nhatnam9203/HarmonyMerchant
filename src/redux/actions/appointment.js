import apiConfigs from '../../configs/api';

export function uploadAvatar(files) {
    return {
        type: 'UPLOAD_AVATAR',
        method: 'POST',
        media: files,
        api: `${apiConfigs.BASE_API}file?category=avatar`
    }
}