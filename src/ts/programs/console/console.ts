import { point, pointToIndex, xyToIndex } from '../../common/utils'
import { SpriteBatch } from '../../graphics/spriteBatch';
import { fontHeight, fontWidth, getCharcode } from '../../graphics/spriteFont';

const padTop = 10;
const padLeft = 10;

export class Console {
    currentPos = point(0, 0);
    buffer: Uint8Array;
    w: number;
    h: number;
    lastCursor = 0;
    hasCursor = false;
    constructor (private screenW: number, private screenH: number) {
        this.w = Math.floor((this.screenW - padLeft) / fontWidth);
        this.h = Math.floor((this.screenH - padTop) / fontHeight);
        this.buffer = new Uint8Array(this.w * this.h);
    }
    get posIndex() {
        return pointToIndex(this.currentPos, this.w);
    }
    set posIndex(value) {
        this.currentPos.x = value % this.w;
        this.currentPos.y = Math.floor(value / this.w);
    }
    print(text: string) {
        text.split('').forEach(c => {
            if (c === '\n') this.endl();
            else this.buffer[this.posIndex++] = getCharcode(c);
        });
    }
    endl() {
        this.currentPos.x = 0;
        this.currentPos.y++;
    }
    draw(batch: SpriteBatch, now: number) {
        for (let y = 0; y < this.h; y++) {
            for (let x = 0; x < this.w; x++) {
                batch.drawCharFromCode(this.buffer[xyToIndex(x, y, this.w)], padLeft + x * fontWidth, padTop + y * fontHeight);
            }
        }
        if (this.hasCursor) batch.drawChar('▬', padLeft + this.currentPos.x * fontWidth, padTop + this.currentPos.y * fontHeight)
        if (now - this.lastCursor > 500) {
            this.hasCursor = !this.hasCursor;
            this.lastCursor = now;
        }
    }
}