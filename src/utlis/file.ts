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

import imageCompression from 'browser-image-compression';

class ImageUtils {
	/**
	 * 压缩并转换图片为 AVIF 格式，限制最大分辨率（适用于浏览器端）
	 *
	 * @param inputFile 输入图片 File 对象
	 * @param quality AVIF 质量（0-100，默认 80，数值越高质量越高，文件越大）
	 * @param maxWidth 限制图片最大宽度（默认 2560，超出时会等比例缩小）
	 * @param maxHeight 限制图片最大高度（默认 1440，超出时会等比例缩小）
	 * @param maxSizeMB 限制图片最大大小（单位 M）
	 * @returns 返回 AVIF 格式的 File 对象
	 */
	static async compressToAvif(
		inputFile: File,
		quality: number = 80,
		maxWidth: number = 2560,
		maxHeight: number = 1440,
		maxSizeMB: number = 2
	): Promise<File> {
		// 配置压缩选项
		const options = {
			maxSizeMB: maxSizeMB, // 限制最大 2MB，浏览器端压缩通常需要设置这个值
			maxWidthOrHeight: Math.max(maxWidth, maxHeight),
			useWebWorker: true, // 使用 Web Worker 以提高性能
			fileType: 'image/avif', // 输出格式为 AVIF
			initialQuality: quality // 设置质量（0-1）
		};

		try {
			// 进行压缩
			const compressedFile = await imageCompression(inputFile, options);

			// 返回转换后的 AVIF 文件
			return new File([await compressedFile.arrayBuffer()], inputFile.name.replace(/\.[^.]+$/, '.avif'), {
				type: 'image/avif'
			});
		} catch (error) {
			console.error('图片压缩失败:', error);
			throw error;
		}
	}

	/**
	 * Base64 图片保存到本地
	 * @param base64String Base64 字符串
	 * @param fileName 文件名
	 */
	static async saveBase64AsImage(base64String: string, fileName: string): Promise<void> {
		// 匹配图片类型的正则表达式
		const regex = /^data:image\/(jpeg|png|gif|svg\+xml|webp|avif|apng|bmp|x-icon);base64,/;

		// 确保Base64字符串格式正确，去除任何非Base64的前缀部分
		const match = base64String.match(regex);
		if (!match) {
			console.error('无效的 Base64 字符串格式。');
			return;
		}

		// 获取图片类型（jpeg、png、gif 或 svg+xml）
		const imageType = match[1];

		// 去除前缀部分，提取Base64编码数据
		const base64Data = base64String.replace(regex, '');

		try {
			// 解码Base64字符串
			const byteCharacters = atob(base64Data);
			const byteArrays = [];

			// 将解码后的字符转换为Uint8Array
			for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
				const byteArray = [];
				for (let i = offset; i < Math.min(offset + 1024, byteCharacters.length); i++) {
					byteArray.push(byteCharacters.charCodeAt(i));
				}
				byteArrays.push(new Uint8Array(byteArray));
			}

			// 创建Blob对象，设置正确的MIME类型
			const blob = new Blob(byteArrays, { type: `image/${imageType}` });

			// 创建下载链接并触发下载
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = fileName; // 设置文件名
			link.click(); // 触发下载
		} catch (error) {
			console.error('解码 Base64 字符串时出错：', error);
		}
	}
}

export default ImageUtils;
