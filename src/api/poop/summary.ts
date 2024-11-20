import service from '@/utlis/request'


export const useSummaryListApi = (data: any) => {
    return service.get('/poop/summary/list', data)
}

export const useUpdateRewardApi = (data: any) => {
    return service.post('/poop/summary/reward', data)
}

export const useRewardApi = (month: string) => {
    return service.get(`/poop/summary/reward/${month}`)
}