import request from '@/utils/request'

export const reqTradeMarkList = (page, limit) => {
    return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
}

export const reqAddOrUpdateTradeMark = (trademark) => {
    if (trademark.id) {
        return request.put('/admin/product/baseTrademark/update', trademark)
    } else {
        return request.post('/admin/product/baseTrademark/save', trademark)
    }
}

export const reqDeleteTradeMark = (id) => {
    return request.delete(`/admin/product/baseTrademark/remove/${id}`)
}