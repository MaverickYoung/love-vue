import service from '@/utlis/request'



export const useUpdateRewardApi = (image: File, month: string) => {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('month', month);

    // 发送 POST 请求，上传文件和月份
    return service.post('/poop/summary/reward', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
}

export const useRewardApi = (month: string) => {
    return service.get(`/poop/summary/reward/${month}`)
}