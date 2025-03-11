import service from '@/utlis/request';


export const useLogPageApi = (size: number, current: number) => {
  return service.get(`/poop/log/page/${size}/${current}`);
};

export const useLogSaveApi = (type: number | undefined) => {
  if (type) {
    return service.post(`/poop/log?type=${type}`);
  }
};

/**
 * 获取便便统计
 * @param {string} start 起始年月 YYYY-MM
 * @param {string} end 结束年月 YYYY-MM
 * @returns
 */
export const useLogListApi = (start?: string, end?: string) => {
  const params = new URLSearchParams();

  if (start) params.append('start', start);
  if (end) params.append('end', end);

  const url = `/poop/log/list?${params.toString()}`;

  return service.get(url);
};
