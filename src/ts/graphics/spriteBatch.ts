import { colorCodes } from "../common/constants";
import { splitColorHexToArray } from "../common/utils";
import { drawCanvasBuffer } from "./canvasUtils";
import { fontHeight, fontLoaded, fontSprites, fontWidth } from "./spriteFont";

export class SpriteBatch {
    context: CanvasRenderingContext2D | null = null;
    lastFontColor = 0x1;
    lastFontColorSet = new Uint8ClampedArray();
    static colorBG = 0x0;
    static colorFG = 0x7;
    constructor (public canvas: HTMLCanvasElement) {}
    get bgColor() {
        return '#' + colorCodes[SpriteBatch.colorBG].toString(16).padStart(6, '0');
    }
    get fontColorSet() {
        const color = colorCodes[SpriteBatch.colorFG];
        if (color !== this.lastFontColor){
            this.lastFontColor = color;
            this.lastFontColorSet = splitColorHexToArray(color);
        }
        return this.lastFontColorSet;
    }
    start() {
        this.context = this.canvas.getContext('2d');
        this.context?.save();
    }
    drawCharFromCode(charCode: number, x: number, y: number) {
        if (!fontLoaded) return;
        this.drawChar(fontSprites[charCode], x, y);
    }
    drawCharFromChar(char: string, x: number, y: number) {
        if (!fontLoaded) return;
        this.drawChar(fontSprites(char), x, y);
    }
    private drawChar(image: HTMLCanvasElement, x: number, y: number) {
        if (!this.context) return;
        const data = image.getContext('2d')!.getImageData(0, 0, fontWidth, fontHeight);
        data.data.forEach((d, i, s) => {
            if (i % 4 === 0) {
                if (d) s.set(this.fontColorSet, i);
            }
        });
        const canvasBuffer = drawCanvasBuffer(`${image.id}-${SpriteBatch.colorBG.toString(16)}${SpriteBatch.colorFG.toString(16)}`, fontWidth, fontHeight, batch => batch.context!.putImageData(data, 0, 0))
        this.context.drawImage(canvasBuffer, x, y);
    }
    drawImage(image: CanvasImageSource, x: number, y: number) {
        if (!this.context) return;
        this.context.drawImage(image, x, y);
    }
    setSmoothing(on: boolean) {
        this.context && (this.context.imageSmoothingEnabled = on);
    }
    scale(x: number, y: number) {
        this.context?.scale(x, y);
    }
    clear() {
        if (!this.context) return;
        this.context.fillStyle = this.bgColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    end() {
        this.context?.restore();
        this.context = null;
    }
}
