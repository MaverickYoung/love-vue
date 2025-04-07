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

import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import { optimize } from 'svgo'; // 新增引入svgo

/* *********************** 配置参数 *********************** */
const CONFIG = {
	// 目录配置
	projectRoot: path.resolve(import.meta.dirname, '..'),
	input: {
		dir: 'script/assets', // 源文件目录
		filter: file => file.endsWith('.svg') // 文件过滤
	},
	outputDir: 'src/assets', // 文件输出目录
	conversion: {
		sizeThreshold: 2 * 1024, // 2KB阈值（小于此值保留SVG）
		maxDimension: 512, // 最大输出尺寸
		defaultQuality: 55, // AVIF默认质量（1-100）
		compressionEffort: 9, // 压缩强度（0-9）
		chromaSubsampling: '4:2:0' // 色度子采样
	}
};

/* *********************** 初始化路径 *********************** */
const PATHS = {
	inputDir: path.join(CONFIG.projectRoot, CONFIG.input.dir),
	outputDir: path.join(CONFIG.projectRoot, CONFIG.outputDir),
	outputIconDir: path.join(CONFIG.projectRoot, CONFIG.outputDir, 'icons')
};

/* *********************** 核心逻辑 *********************** */
async function processFiles() {
	// 确保输出目录存在并清空它
	fs.emptyDirSync(PATHS.outputDir);
	fs.ensureDirSync(PATHS.outputIconDir);

	// 获取文件列表
	const files = fs.readdirSync(PATHS.inputDir).filter(CONFIG.input.filter);

	if (files.length === 0) {
		console.log(`ℹ️ 没有找到 SVG 文件！（输入目录: ${PATHS.inputDir}）`);
		return;
	}

	/* *************** 准备数据报表 *************** */
	const headers = ['文件名', '原始大小', 'SVGO大小', 'SVGO压缩率', 'SVGO状态', 'AVIF大小', 'AVIF压缩率', 'AVIF状态'];
	const reportData = [];
	let counters = {
		svgo: { success: 0, skipped: 0, failed: 0 },
		avif: { success: 0, skipped: 0, failed: 0 }
	};

	console.log(`ℹ️ 开始处理 ${files.length} 个文件...`);

	/* *************** 并行处理文件 *************** */
	await Promise.all(
		files.map(async file => {
			const inputPath = path.join(PATHS.inputDir, file);
			const avifPath = path.join(PATHS.outputIconDir, file.replace('.svg', '.avif'));
			const svgPath = path.join(PATHS.outputIconDir, file);

			let svgoStatus = '✅ 成功',
				avifStatus = '-';

			try {
				// 读取原始 SVG 内容
				const originalSVG = fs.readFileSync(inputPath, 'utf8');
				const originalSize = Buffer.byteLength(originalSVG);

				// 使用 SVGO 进行优化
				const optimizedResult = optimize(originalSVG, { multipass: true });
				if (optimizedResult.error) {
					throw new Error(optimizedResult.error);
				}
				const optimizedSVG = optimizedResult.data;
				const optimizedSize = Buffer.byteLength(optimizedSVG);

				// 计算 SVGO 处理后的压缩率
				const svgoCompressionRate = calculateCompression(originalSize, optimizedSize);

				// 创建 Buffer 供 sharp 处理
				const optimizedBuffer = Buffer.from(optimizedSVG, 'utf8');

				if (optimizedSize < CONFIG.conversion.sizeThreshold) {
					// 文件太小，不进行 AVIF 转换
					fs.writeFileSync(svgPath, optimizedSVG, 'utf8');
					avifStatus = '⏩ 跳过';
					counters.svgo.success++; // SVGO 成功计数
					counters.avif.skipped++; // AVIF 跳过计数
					reportData.push([
						file,
						formatSize(originalSize),
						formatSize(optimizedSize),
						svgoCompressionRate,
						svgoStatus,
						'-',
						'-',
						avifStatus
					]);
				} else {
					// 转换为 AVIF
					const metadata = await sharp(optimizedBuffer).metadata();
					const { width, height } = calculateDimensions(
						metadata.width,
						metadata.height,
						CONFIG.conversion.maxDimension
					);
					await sharp(optimizedBuffer)
						.resize({
							width,
							height,
							fit: 'inside',
							withoutEnlargement: true
						})
						.avif({
							quality: CONFIG.conversion.defaultQuality,
							effort: CONFIG.conversion.compressionEffort,
							chromaSubsampling: CONFIG.conversion.chromaSubsampling
						})
						.toFile(avifPath);

					const avifSize = fs.statSync(avifPath).size;
					const avifCompressionRate = calculateCompression(optimizedSize, avifSize);
					avifStatus = avifCompressionRate.startsWith('-') ? '❗ 警告' : '✅ 成功';

					counters.svgo.success++; // SVGO 成功计数
					counters.avif.success++; // AVIF 成功计数

					// 只在未生成 AVIF 的情况下才导出 SVG
					if (avifStatus !== '✅ 成功') {
						fs.writeFileSync(svgPath, optimizedSVG, 'utf8');
					}

					reportData.push([
						file,
						formatSize(originalSize),
						formatSize(optimizedSize),
						svgoCompressionRate,
						svgoStatus,
						formatSize(avifSize),
						avifCompressionRate,
						avifStatus
					]);
				}
			} catch (error) {
				svgoStatus = '❌ 失败';
				avifStatus = '❌ 失败';
				if (error.message.includes('SVGO')) {
					counters.svgo.failed++; // SVGO 失败计数
				} else {
					counters.avif.failed++; // AVIF 失败计数
				}
				handleError(file, error, reportData, svgoStatus, avifStatus);
			}
		})
	);

	/* *************** 输出结果 *************** */
	printReport(headers, reportData);
	console.log('转换统计：');
	console.log(
		`SVGO - ✅ 成功: ${counters.svgo.success}\t⏩ 跳过: ${counters.svgo.skipped}\t❌ 失败: ${counters.svgo.failed}`
	);
	console.log(
		`AVIF - ✅ 成功: ${counters.avif.success}\t⏩ 跳过: ${counters.avif.skipped}\t❌ 失败: ${counters.avif.failed}\n`
	);
}

/* *********************** 工具函数 *********************** */

// 处理错误
function handleError(file, error, report, counters) {
	console.error(`处理 ${file} 时出错:`, error.message);
	report.push([file, '-', '-', '-', '❌ 失败']);
	counters.failed++;
}

// 尺寸计算
function calculateDimensions(originalWidth, originalHeight, maxSize) {
	return {
		width: Math.min(originalWidth || maxSize, maxSize),
		height: Math.min(originalHeight || maxSize, maxSize)
	};
}

// 压缩率计算
function calculateCompression(inputSize, outputSize) {
	if (inputSize === 0) return '0.00%';
	const rate = ((1 - outputSize / inputSize) * 100).toFixed(2);
	return outputSize > inputSize ? `-${Math.abs(rate)}%` : `${rate}%`;
}

// 文件大小格式化
function formatSize(bytes) {
	return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(2)} KB`;
}

/* *********************** 报表输出 *********************** */
function printReport(headers, data) {
	// 计算每列宽度（考虑全角字符）
	const colWidths = headers.map((h, i) => {
		const maxDataWidth = Math.max(...data.map(row => getStringWidth(row[i])));
		return Math.max(getStringWidth(h), maxDataWidth);
	});

	// 生成分隔线
	const separator = '├' + colWidths.map(w => '─'.repeat(w + 2)).join('┼') + '┤';

	// 格式化行输出
	const formatRow = row => {
		return (
			'│ ' +
			row
				.map((cell, i) => {
					const padding = colWidths[i] - getStringWidth(cell);
					return cell + ' '.repeat(padding < 0 ? 0 : padding);
				})
				.join(' │ ') +
			' │'
		);
	};

	console.log('┌' + colWidths.map(w => '─'.repeat(w + 2)).join('┬') + '┐');
	console.log(formatRow(headers));
	console.log(separator);
	data.forEach(row => console.log(formatRow(row)));
	console.log('└' + colWidths.map(w => '─'.repeat(w + 2)).join('┴') + '┘');
}

// 计算字符串宽度（支持全角字符）
function getStringWidth(str) {
	return [...str].reduce((width, char) => {
		const code = char.codePointAt(0);
		if (
			(code >= 0x4e00 && code <= 0x9fff) || // 中文
			(code >= 0x1f600 && code <= 0x1f64f) || // Emoji
			(code >= 0xff00 && code <= 0xffef) // 全角符号
		) {
			return width + 2;
		}
		return width + 1;
	}, 0);
}

/* *********************** 生成 index.ts *********************** */
function generateIndexTs() {
	const files = fs.readdirSync(PATHS.outputIconDir).filter(file => file.endsWith('.svg') || file.endsWith('.avif'));

	if (files.length === 0) {
		console.log('ℹ️ 没有可导出的文件，跳过 index.ts 生成。');
		return;
	}

	const indexPath = path.join(PATHS.outputDir, 'index.ts');
	const exports = files
		.map(file => {
			let name = path
				.basename(file, path.extname(file))
				.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : '')) // 转换为驼峰名
				.replace(/^(\d)/, '_$1'); // 如果是数字开头，前面加 `_`

			// 确保首字母大写（大驼峰）
			name = name.charAt(0).toUpperCase() + name.slice(1);

			// 添加 'Icon' 后缀
			name = `${name}Icon`;

			return `export { default as ${name} } from './icons/${file}';`;
		})
		.join('\n');

	fs.writeFileSync(indexPath, exports, 'utf8');
	console.log(`✅ 生成 index.ts (${files.length} 个导出项)\n`);
	console.log('🎉 处理完成！');
}

/* *********************** 执行程序 *********************** */
processFiles()
	.then(generateIndexTs)
	.catch(err => {
		console.error('❌ 发生未捕获错误:', err);
		process.exit(1);
	});
