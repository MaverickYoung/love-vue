import service from '@/utlis/request'

export const useCaptchaEnabledApi = () => {
    return service.get('/sys/auth/captcha/enabled')
}

export const useCaptchaApi = () => {
    return service.get('/sys/auth/captcha')
}

export const useAccountLoginApi = (data: any) => {
    return service.post('/sys/auth/login', data)
}

export const useLogoutApi = () => {
    return service.post('/sys/auth/logout')
}
