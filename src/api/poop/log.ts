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

import service from '@/utlis/request'

export const useLogPageApi = (size: number, current: number) => {
	return service.get(`/poop/log/page/${size}/${current}`)
}

export const useLogSaveApi = (type: number | undefined) => {
	if (type) {
		return service.post(`/poop/log?type=${type}`)
	}
}

/**
 * 获取便便统计
 * @param {string} start 起始年月 YYYY-MM
 * @param {string} end 结束年月 YYYY-MM
 * @returns
 */
export const useLogListApi = (start?: string, end?: string) => {
	const params = new URLSearchParams()

	if (start) params.append('start', start)
	if (end) params.append('end', end)

	const url = `/poop/log/list?${params.toString()}`

	return service.get(url)
}
