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

import fs from 'fs-extra'
import path from 'path'
import sharp from 'sharp'
import { optimize } from 'svgo'

/* *********************** 配置参数 *********************** */
const CONFIG = {
	projectRoot: path.resolve(import.meta.dirname, '..'),
	input: {
		dir: 'script/assets', // 源文件目录
		filter: file => file.endsWith('.svg') // 文件过滤
	},
	outputDir: 'src/assets', // 文件输出目录
	conversion: {
		outputSizes: [32, 128, 512], // 需要生成的尺寸
		defaultQuality: 55, // AVIF默认质量（1-100）
		compressionEffort: 9, // 压缩强度（0-9）
		chromaSubsampling: '4:2:0' // 色度子采样
	},
	report: {
		filename: '图片转换报告.md'
	}
}

/* *********************** 路径配置 *********************** */
const PATHS = {
	inputDir: path.join(CONFIG.projectRoot, CONFIG.input.dir),
	outputDir: path.join(CONFIG.projectRoot, CONFIG.outputDir),
	outputIconDir: path.join(CONFIG.projectRoot, CONFIG.outputDir, 'icons'),
	report: path.join(CONFIG.projectRoot, CONFIG.outputDir, CONFIG.report.filename)
}

/* *********************** 核心处理逻辑 *********************** */
const processFiles = async () => {
	// 清空输出目录，确保目录存在
	fs.emptyDirSync(PATHS.outputDir)
	fs.ensureDirSync(PATHS.outputIconDir)

	const report = {
		meta: { totalFiles: 0, successCount: 0, failedCount: 0, totalSavings: 0 },
		svgData: [],
		avifData: new Map()
	}

	// 获取输入目录中的所有符合条件的文件
	const files = fs.readdirSync(PATHS.inputDir).filter(CONFIG.input.filter)
	report.meta.totalFiles = files.length

	// 如果没有找到文件，则生成报告并结束
	if (files.length === 0) {
		fs.writeFileSync(PATHS.report, '# 转换报告\n\n没有找到任何SVG文件')
		return
	}

	console.log(`开始处理 ${files.length} 个文件...`)

	// 逐个处理文件
	for (const file of files) {
		const inputPath = path.join(PATHS.inputDir, file)
		try {
			const originalSVG = fs.readFileSync(inputPath, 'utf8')
			const optimized = optimize(originalSVG, { multipass: true })
			const originalSize = Buffer.byteLength(originalSVG)
			const optimizedSize = Buffer.byteLength(optimized.data)

			// 记录优化结果
			report.svgData.push({
				file,
				originalSize,
				optimizedSize
			})

			const baseName = path.basename(file, '.svg')
			const avifResults = []
			for (const size of CONFIG.conversion.outputSizes) {
				const avifPath = path.join(PATHS.outputIconDir, `${baseName}_${size}.avif`)

				// 使用 Sharp 进行 AVIF 转换
				await sharp(Buffer.from(optimized.data))
					.resize(size, size, { fit: 'inside' })
					.avif(CONFIG.conversion)
					.toFile(avifPath)

				const avifSize = fs.statSync(avifPath).size
				const compressionRate = ((1 - avifSize / originalSize) * 100).toFixed(2) + '%'
				avifResults.push({ size, avifSize, compressionRate })
				report.meta.totalSavings += originalSize - avifSize
			}

			report.avifData.set(file, avifResults)
			report.meta.successCount++
		} catch (error) {
			report.meta.failedCount++
			console.error(`处理 ${file} 失败:`, error.message)
		}
	}

	// 生成报告和索引文件
	generateMarkdownReport(report)
	generateIndexTs()
	console.log('处理完成！')
}

/* *********************** 生成 Markdown 报告 *********************** */
const generateMarkdownReport = report => {
	let content = `# 转换报告\n\n`
	content += `共处理文件: ${report.meta.totalFiles}，成功: ${report.meta.successCount}，失败: ${report.meta.failedCount}\n\n`

	content += `## SVG 优化结果\n\n`
	content += `| 文件名 | 原始大小 | 优化后大小 |\n|---|---|---|\n`
	report.svgData.forEach(({ file, originalSize, optimizedSize }) => {
		content += `| ${file} | ${formatSize(originalSize)} | ${formatSize(optimizedSize)} |\n`
	})

	content += `\n## AVIF 转换结果\n\n`
	content += `| 文件名 | 目标尺寸 | AVIF大小 | 压缩率 |\n|---|---|---|---|\n`
	report.avifData.forEach((sizes, file) => {
		sizes.forEach(({ size, avifSize, compressionRate }, index) => {
			content += `| ${index === 0 ? file : ''} | ${size}px | ${formatSize(avifSize)} | ${compressionRate} |\n`
		})
	})

	fs.writeFileSync(PATHS.report, content)
}

/* *********************** 生成 index.ts *********************** */
const generateIndexTs = () => {
	const files = fs.readdirSync(PATHS.outputIconDir).filter(file => file.endsWith('.avif'))

	const imports = files
		.map(file => {
			const baseName = path.basename(file, '.avif')
			const match = baseName.match(/^(.*?)(_\d+)$/)
			let varName
			if (match) {
				const mainPart = match[1]
				const sizePart = match[2] // 尺寸部分，例如 _24
				varName = 'Icon' + toPascalCase(mainPart) + sizePart
			} else {
				varName = 'Icon' + toPascalCase(baseName)
			}
			return `import ${varName} from './icons/${file}';`
		})
		.join('\n')

	const exports = `export {\n  ${files
		.map(file => {
			const baseName = path.basename(file, '.avif')
			const match = baseName.match(/^(.*?)(_\d+)$/)
			let varName
			if (match) {
				const mainPart = match[1]
				const sizePart = match[2]
				varName = 'Icon' + toPascalCase(mainPart) + sizePart
			} else {
				varName = 'Icon' + toPascalCase(baseName)
			}
			return varName
		})
		.join(',\n  ')}\n};`

	fs.writeFileSync(path.join(PATHS.outputDir, 'index.ts'), `${imports}\n\n${exports}\n`)
}

/* *********************** 辅助方法 *********************** */
const formatSize = bytes => (bytes / 1024).toFixed(2) + ' KB'

const toPascalCase = str =>
	str
		.replace(/[_-]+/g, ' ') // 替换下划线或破折号为空格
		.replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()) // 每个单词首字母大写
		.replace(/\s+/g, '') // 去掉空格

// 执行处理逻辑
processFiles()
