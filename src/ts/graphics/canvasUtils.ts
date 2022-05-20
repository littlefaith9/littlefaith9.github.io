import { SpriteBatch } from "./spriteBatch";

export function createCanvas(width: number, height: number) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

const canvasBuffer = new Map<string, HTMLCanvasElement>();
export function drawCanvasBuffer(name: string, width: number, height: number, draw: (batch: SpriteBatch) => void) {
    let canvas = canvasBuffer.get(name);
    if (canvas) return canvas;
    canvas = createCanvas(width, height);
    const batch = new SpriteBatch(canvas);
    batch.start();
    draw(batch);
    batch.end();
    canvasBuffer.set(name, canvas);
    return canvas;
}
