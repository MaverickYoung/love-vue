/*
 * MIT License
 *
 * Copyright (c) 2025 Maverick Young
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import service from '@/utlis/request';

export const useUserInfoApi = () => {
  return service.get('/sys/user/info');
};

export const useUserInfoSubmitApi = (dataForm: any) => {
  return service.put('/sys/user/info', dataForm);
};

export const useUpdatePasswordApi = (data: any) => {
  return service.put('/sys/user/password', data);
};

export const useUserProfileApi = (idList: number[]) => {
  return service.get(`/sys/user/profile?idList=${idList}`);
};

export const useUpdateAvatarApi = (image: File) => {
  const formData = new FormData();
  formData.append('file', image);

  // 发送 PUT 请求，上传文件
  return service.put('/sys/user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const useUpdateBackgroundApi = (image: File) => {
  const formData = new FormData();
  formData.append('file', image);

  // 发送 POST 请求，上传文件和月份
  return service.put('/sys/user/background', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
