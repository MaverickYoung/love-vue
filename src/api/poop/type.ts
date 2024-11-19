import service from '@/utlis/request'

export const usePoopsApi = () => {
    return service.get(`/poop/type`);
}
