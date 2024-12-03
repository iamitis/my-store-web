export function getAssets(url: string) {
    return new URL(`/src/assets/${url}`, import.meta.url).href
}

export function copyLinkToClipboard(link: string) {
    navigator.clipboard.writeText(link).then(() => {
        ElMessage.success('已复制分享链接到剪贴板')
    }).catch(err => {
        ElMessage.error('复制分享链接失败 ' + err)
    });
}
