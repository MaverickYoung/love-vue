import service from '@/utlis/request'


export const useSummaryListApi = (data: any) => {
    return service.get('/poop/summary/list', data)
}

export const useRewardApi = (data: any) => {
    return service.post('/poop/summary/reward', data)
}
