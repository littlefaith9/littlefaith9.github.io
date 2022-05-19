export function times<T>(repeat: number, item: (index: number) => T): T[] {
    const array: T[] = [];
    for (let i = 0; i < repeat; i++)
        array.push(item(i));
    return array;
}

export function times2<T>(repeat: number, item: (index: number) => T): Promise<T[]> {
    const array: T[] = [];
    for (let i = 0; i < repeat; i++)
        array.push(item(i));
    return Promise.resolve(array);
}

export function isNumber(obj: unknown): obj is number {
    return typeof obj === 'number';
}

export interface Point {
    x: number;
    y: number;
}

export function point(x: number, y: number) {
    return { x, y };
}

// export function pointToIndex(point: Point, width: number): number;
// export function pointToIndex(x: number, y: number, width: number): number;
// export function pointToIndex(point?: Point, x?: number, y?: number, width?: number): number {
//     if (point && isNumber(width)) return point.x + point.y * width;
//     if (isNumber(x) && isNumber(y) && isNumber(width)) return x + y * width;
//     throw new Error('no param matches overload'); 
// }

export const pointToIndex = (point: Point, width: number) => point.x + point.y * width;
export const xyToIndex = (x: number, y: number, width: number) => x + y * width;

export interface Rect extends Point {
    w: number;
    h: number;
}