import service from '@/utlis/request'

export const useUserInfoApi = () => {
    return service.get('/sys/user/info')
}

export const useUserInfoSubmitApi = (dataForm: any) => {
    return service.put('/sys/user/info', dataForm)
}

export const useUpdatePasswordApi = (data: any) => {
    return service.put('/sys/user/password', data)
}

export const useUserProfileApi = (idList: number[]) => {
    return service.get(`/sys/user/profile?idList=${idList}`)
}

export const useUpdateAvatarApi=(image: File) => {
    const formData = new FormData();
    formData.append('file', image);

    // 发送 PUT 请求，上传文件
    return service.put('/sys/user/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
}

export const useUpdateBackgroundApi=(image: File) => {
    const formData = new FormData();
    formData.append('file', image);

    // 发送 POST 请求，上传文件和月份
    return service.put('/sys/user/background', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
}



