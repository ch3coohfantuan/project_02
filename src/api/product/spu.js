import request from '@/utils/request'

export const reqSpuList = (page, limit, c3Id) => {
    return request({
        url: `/admin/product/${page}/${limit}`,
        method: 'get',
        params: { category3Id: c3Id }
    })
}

export const reqSpu = (spuId) => {
    return request.get(`/admin/product/getSpuById/${spuId}`)
}

export const reqTradeMarkList = () => {
    return request.get('/admin/product/baseTrademark/getTrademarkList')
}

export const reqSpuImageList = (spuId) => {
    return request.get(`/admin/product/spuImageList/${spuId}`)
}

export const reqSaleAttrList = () => {
    return request.get('/admin/product/baseSaleAttrList')
}

export const reqAddOrUpdateSpu = (data) => {
    if (data.id) {
        return request.post('/admin/product/updateSpuInfo', data)
    } else {
        return request.post('/admin/product/saveSpuInfo', data)
    }
}

export const reqDeleteSpu = (spuId) => {
    return request.delete(`/admin/product/deleteSpu/${spuId}`)
}