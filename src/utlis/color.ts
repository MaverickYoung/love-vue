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

export interface Rgba {
	r: number;
	g: number;
	b: number;
	a?: number;
}

export interface Hsv {
	h: number;
	s: number;
	v: number;
}

export const parseColor = (color: string | Rgba): Rgba | null => {
	if (color) {
		if (typeof color === 'string') {
			if (/^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{8}|[0-9a-fA-F]{3}|[0-9a-fA-F]{4})$/.test(color)) {
				return hex2rgba(color);
			} else if (color.includes('linear-gradient')) {
				const matchColors = color.match(/#[0-9a-fA-F]{6}/g);
				if (matchColors) {
					const avgColor = getAvgColor(matchColors);
					return hex2rgba(avgColor);
				}
			}
		} else {
			const r = Math.min(255, Math.max(0, color.r));
			const g = Math.min(255, Math.max(0, color.g));
			const b = Math.min(255, Math.max(0, color.b));
			const a = color.a !== undefined ? Math.min(1, Math.max(0, color.a)) : 1;
			return { r, g, b, a };
		}
	}
	return null;
};

export const hsv2rgb = (h: number, s: number, v: number): Rgba => {
	h = h === 360 ? 0 : h;
	const i = Math.floor(h / 60) % 6;
	const f = h / 60 - i;
	const p = v * (1 - s);
	const q = v * (1 - s * f);
	const t = v * (1 - s * (1 - f));

	let r: number = 0,
		g: number = 0,
		b: number = 0;
	switch (i) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = v;
			b = p;
			break;
		case 2:
			r = p;
			g = v;
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = v;
			break;
		case 4:
			r = t;
			g = p;
			b = v;
			break;
		case 5:
			r = v;
			g = p;
			b = q;
			break;
	}

	return {
		r: Math.floor(r * 255 + 0.5),
		g: Math.floor(g * 255 + 0.5),
		b: Math.floor(b * 255 + 0.5),
		a: 1
	};
};

export const rgb2hsv = (r: number, g: number, b: number): Hsv => {
	const red = r / 255;
	const green = g / 255;
	const blue = b / 255;

	const maxColor = Math.max(red, green, blue);
	const minColor = Math.min(red, green, blue);
	const delta = maxColor - minColor;

	let hue: number, saturation: number, value: number;

	if (delta === 0) {
		hue = 0;
	} else if (maxColor === red) {
		hue = ((60 * (green - blue)) / delta + 360) % 360;
	} else if (maxColor === green) {
		hue = 60 * ((blue - red) / delta + 2);
	} else {
		hue = 60 * ((red - green) / delta + 4);
	}

	saturation = maxColor === 0 ? 0 : delta / maxColor;
	value = maxColor;

	return {
		h: Math.round(hue),
		s: Math.round(saturation * 100) / 100,
		v: Math.round(value * 100) / 100
	};
};

export const rgba2hex = (r: number, g: number, b: number, a: number = 1): string => {
	const toHex = (n: number): string => n.toString(16).padStart(2, '0').toUpperCase();

	const alphaHex = a !== 1 ? toHex(Math.floor(a * 255)) : '';
	return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`;
};

export const hex2rgba = (hex: string): Rgba => {
	if (/^#?[0-9a-fA-F]{3}$/.test(hex)) {
		const [r, g, b] = hex
			.slice(1)
			.split('')
			.map(s => parseInt(s + s, 16));
		return { r, g, b, a: 1 };
	}

	if (/^#?[0-9a-fA-F]{6}$/.test(hex)) {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return { r, g, b, a: 1 };
	}

	if (/^#?[0-9a-fA-F]{8}$/.test(hex)) {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		const a = parseInt(hex.slice(7, 9), 16) / 255;
		return { r, g, b, a };
	}

	throw new Error('Invalid hex color format');
};

export const getAvgColor = (colors: string[]): string => {
	const sum = colors.map(hex2rgba).reduce(
		(acc, { r, g, b }) => ({
			r: acc.r + r,
			g: acc.g + g,
			b: acc.b + b
		}),
		{ r: 0, g: 0, b: 0 }
	);

	const avg = {
		r: Math.round(sum.r / colors.length),
		g: Math.round(sum.g / colors.length),
		b: Math.round(sum.b / colors.length)
	};

	return rgba2hex(avg.r, avg.g, avg.b);
};
