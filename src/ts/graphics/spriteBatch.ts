import { fontLoaded, fontSprites } from "./spriteFont";

export class SpriteBatch {
    context: CanvasRenderingContext2D | null = null;
    fillStyle = '#000';
    constructor (public canvas: HTMLCanvasElement) {}
    start() {
        this.context = this.canvas.getContext('2d');
        this.context?.save();
    }
    drawCharFromCode(charCode: number, x: number, y: number) {
        if (!this.context || !fontLoaded) return;
        this.context!.drawImage(fontSprites[charCode], x, y);
    }
    drawChar(char: string, x: number, y: number) {
        if (!this.context || !fontLoaded) return;
        this.context!.drawImage(fontSprites(char), x, y);
    }
    setSmoothing(on: boolean) {
        this.context && (this.context.imageSmoothingEnabled = on);
    }
    scale(w: number, h: number) {
        this.context?.scale(w, h);
    }
    clear() {
        if (!this.context) return;
        this.context.fillStyle = this.fillStyle;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    end() {
        this.context?.restore();
        this.context = null;
    }
}
