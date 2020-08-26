import apiConfigs from '../../configs/api';

export function uploadAvatar(files) {
    return {
        type: 'UPLOAD_AVATAR',
        method: 'POST',
        media: files,
        api: `${apiConfigs.BASE_API}file?category=avatar`
    }
}

export function resetStateUpload() {
    return {
        type: 'RESET_STATE_UPLOAD'
    }
}

export function uploadBanner(files, infoBanner, merchantId) {
    return {
        type: 'UPLOAD_BANNER',
        method: 'POST',
        media: files,
        api: `${apiConfigs.BASE_API}file?category=avatar`,
        infoBanner,
        merchantId
    }
}

export function exportBatchHistory(key = "", timeStart = "", timeEnd = "", quickFilter = "", page = 1) {
    return {
        type: 'EXPORT_BATCH_HISTORY',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}settlement/search/export?key=${key}&timeStart=${timeStart}&timeEnd=${timeEnd}&quickFilter=${quickFilter}&page=${page}`,
    }
}
