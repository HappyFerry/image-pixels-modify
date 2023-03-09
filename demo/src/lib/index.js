var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const getImageSize = (imgPath) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = imgPath;
        img.onload = () => {
            resolve([img.width, img.height]);
        };
    });
});
const getLoadedImage = (imgPath) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = imgPath;
        img.onload = () => {
            resolve(img);
        };
    });
});
function createCanvasElement(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
}
function getImageDataAndCanvas(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const img = yield getLoadedImage(url);
        const canvas = createCanvasElement(img.width, img.height);
        const ctx = canvas.getContext("2d"); // 设置在画布上绘图的环境
        // 获取画布宽高
        const w = canvas.width;
        const h = canvas.height;
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(img, 0, 0, w, h); // 将图片绘制到画布上
        const imgData = ctx === null || ctx === void 0 ? void 0 : ctx.getImageData(0, 0, w, h); // 获取画布上的图像像素
        ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(0, 0, w, h);
        return [imgData.data, canvas];
    });
}
// 将像素数据格式化
export function normalize(data, width, height) {
    const list = [];
    const result = [];
    const len = Math.ceil(data.length / 4);
    // 将每一个像素点的rgba四个值组合在一起
    for (let i = 0; i < len; i++) {
        const start = i * 4;
        list.push([data[start], data[start + 1], data[start + 2], data[start + 3]]);
    }
    for (let hh = 0; hh < height; hh++) {
        const tmp = [];
        for (let ww = 0; ww < width; ww++) {
            tmp.push(list[hh * width + ww]);
        }
        result.push(tmp);
    }
    return result;
}
// 修改图片的颜色(修补图片颜色：缺蓝)
function peeling(data, width, height) {
    // 矩阵格式化数据
    const rectData = normalize(data, width, height);
    for (let i = 0; i < rectData.length; i++) {
        // 行数对应矩阵高度
        for (let j = 0; j < rectData[i].length; j++) {
            // 列数对应宽度
            const [r, g, b, a] = rectData[i][j];
            if (r >= 200 && r <= 255 && g >= 180 && g <= 255 && b >= 0 && b <= 120) {
                rectData[i][j] = [255, 255, 255, a];
            }
            else if (r >= 0 && r <= 40 && g >= 160 && g <= 255) {
                rectData[i][j] = [0, 52, 236, a];
            }
        }
    }
    return rectData;
}
// 矩阵数据扁平化
export function restoreData(data) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            result.push(data[i][j][0], data[i][j][1], data[i][j][2], data[i][j][3]);
        }
    }
    return result;
}
// 反向滤镜
function reverseFilter(pixels) {
    for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] = 255 - pixels[i];
        pixels[i + 1] = 255 - pixels[i + 1];
        pixels[i + 2] = 255 - pixels[i + 2];
    }
}
// 去色滤镜
export function achromaticFilter(data) {
    for (let i = 0; i < data.length; i++) {
        const avg = Math.floor((Math.min(data[i], data[i + 1], data[i + 2]) +
            Math.max(data[i], data[i + 1], data[i + 2])) /
            2);
        data[i] = data[i + 1] = data[i + 2] = avg;
    }
}
// 连环画滤镜
export function comicFilter(data) {
    for (let i = 0; i < data.length; i++) {
        const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
        const newR = (Math.abs(g - b + g + r) * r) / 256;
        const newG = (Math.abs(b - g + b + r) * r) / 256;
        const newB = (Math.abs(b - g + b + r) * g) / 256;
        const rgbArr = [newR, newG, newB];
        [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]] = rgbArr;
    }
}
// add blue
export function addBlue(data) {
    for (let i = 0; i < data.length; i += 4) {
        data[i + 2] = data[i];
    }
}
/**
 * modify image through imgDataHandler function
 * @param url
 * @param imgDataHandler
 * @returns base64 string
 */
export function modifyImage(url, imgDataHandler) {
    return __awaiter(this, void 0, void 0, function* () {
        const [pixels, canvas] = yield getImageDataAndCanvas(url);
        imgDataHandler(pixels);
        const ctx = canvas.getContext("2d");
        const matrix_obj = ctx === null || ctx === void 0 ? void 0 : ctx.createImageData(canvas.width, canvas.height);
        matrix_obj === null || matrix_obj === void 0 ? void 0 : matrix_obj.data.set(pixels);
        // 将修改后的像素数据放回Canvas
        ctx === null || ctx === void 0 ? void 0 : ctx.putImageData(matrix_obj, 0, 0);
        return canvas.toDataURL("image/jpeg");
    });
}
