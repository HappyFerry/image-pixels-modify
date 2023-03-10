export declare const getImageSize: (imgPath: string) => Promise<[number, number]>;
export declare function getImageDataAndCanvas(url: string): Promise<[Uint8ClampedArray, HTMLCanvasElement]>;
export declare function normalize(data: Uint8ClampedArray, width: number, height: number): number[][][];
export declare function restoreData(data: number[][][]): number[];
export declare function reverseFilter(pixels: Uint8ClampedArray): void;
export declare function achromaticFilter(data: Uint8ClampedArray): void;
export declare function comicFilter(data: Uint8ClampedArray): void;
export declare function addBlue(data: Uint8ClampedArray): void;
/**
 * modify image through imgDataHandler function
 * @param url
 * @param imgDataHandler
 * @returns base64 string
 */
export declare function modifyImage(url: string, imgDataHandler: (data: Uint8ClampedArray) => void): Promise<string>;
