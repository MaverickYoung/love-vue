import service from '@/utlis/request'


export const useLogPageApi = (size: number, current: number) => {
    return service.get(`/poop/log/page/${size}/${current}`);
}

export const useLogSaveApi = (type: number | undefined) => {
    if (type) {
        return service.post(`/poop/log?type=${type}`)
    }
}
