import request from '@/utils/request'

export const reqCategory1List = () => {
    return request.get('/admin/product/getCategory1')
}

export const reqCategory2List = (category1Id) => {
    return request.get(`/admin/product/getCategory2/${category1Id}`)
}

export const reqCategory3List = (category2Id) => {
    return request.get(`/admin/product/getCategory3/${category2Id}`)
}

export const reqAttrList = (category1Id, category2Id, category3Id) => {
    return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
}

export const reqAddOrUpdateAttr = (data) => {
    return request.post('/admin/product/saveAttrInfo', data)
}

export const reqDeleteAttr = (attrId) => {
    return request.delete(`/admin/product/deleteAttr/${attrId}`)
}