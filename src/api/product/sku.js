import request from '@/utils/request'

export const reqSpuImageList = (spuId) => {
    return request.get(`/admin/product/spuImageList/${spuId}`)
}

export const reqSpuSaleList = (spuId) => {
    return request.get(`/admin/product/spuSaleAttrList/${spuId}`)
}

export const reqAttrInfoList = (category1Id, category2Id, category3Id) => {
    return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
}

export const reqAddSku = (data) => {
    return request.post('/admin/product/saveSkuInfo', data)
}

export const reqSkuList = (spuId) => {
    return request.get(`/admin/product/findBySpuId/${spuId}`)
}

export const reqAllSkuList = (page,limit) => {
    return request.get(`/admin/product/list/${page}/${limit}`)
}

export const reqSale = (skuId) => {
    return request.get(`/admin/product/onSale/${skuId}`)
}

export const reqCancel = (skuId) => {
    return request.get(`/admin/product/cancelSale/${skuId}`)
}

export const reqSkuById = (skuId) => {
    return request.get(`/admin/product/getSkuById/${skuId}`)
}