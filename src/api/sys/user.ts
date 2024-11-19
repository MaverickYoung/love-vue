import service from '@/utlis/request'

export const useUserInfoApi = () => {
    return service.get('/sys/user/info')
}

export const useUserInfoSubmitApi = (dataForm: any) => {
    return service.put('/sys/user/info', dataForm)
}

export const updatePasswordApi = (data: any) => {
    return service.put('/sys/user/password', data)
}

export const useUserApi = (id: number) => {
    return service.get(`/sys/user/${id}`)
}

export const useUserSubmitApi = (dataForm: any) => {
    if (dataForm.id) {
        return service.put('/sys/user', dataForm)
    } else {
        return service.post('/sys/user', dataForm)
    }
}

export const useUserProfileApi = (idList: number[]) => {
    return service.get(`/sys/user/profile?idList=${idList}`)
}

