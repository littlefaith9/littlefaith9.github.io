import { times } from "../../common/utils";
import { SpriteBatch } from "../../graphics/spriteBatch";
import { Beeper } from "./beep";
import { Console } from "./console";

export class GlitchScreen {
    private readonly lastColorBG = SpriteBatch.colorBG;
    private readonly lastColorFG = SpriteBatch.colorFG;
    private running = true;
    constructor (private console: Console) {}
    public async run() {
        const ESCEvent = (ev: KeyboardEvent) => {
            if (ev.keyCode === 27) {
                this.running = false;
            }
        }
        window.addEventListener('keydown', ESCEvent);
        this.bs();
        await this.clear()
        await this.glitch()
        SpriteBatch.colorBG = this.lastColorBG;
        SpriteBatch.colorFG = this.lastColorFG;
        this.console.clear();
        window.removeEventListener('keydown', ESCEvent);
        Beeper.stop();
    }
    private bs() {
        SpriteBatch.colorBG = 0x1;
        SpriteBatch.colorFG = 0xf;
    }
    private async clear() {
        this.console.clear();
        this.console.currentPos.x = 0;
        this.console.currentPos.y = this.console.h - 5;
        this.console.print(times(this.console.w, () => 250));
        this.console.currentPos.x = Math.floor(this.console.w / 2) - 8;
        this.console.print('starting GUI...');
        this.console.currentPos.x = 0;
        this.console.currentPos.y = this.console.h - 5;
        await new Promise(res => setTimeout(res, 1000))
        for (let i = 0; i < 32 + Math.random() * 16; i++) {
            this.console.print('>');
            await new Promise(res => setTimeout(res, 1));
        }
        await new Promise(res => setTimeout(res, 1000))
    }
    private glitch() {
        this.console.posIndex = this.console.w * this.console.h - 1;
        this.console.print('Unsupported platform');
        return new Promise<void>(res => {
            let count = 0;
            const intv = setInterval(() => {
                if (!this.running || count++ > 64 && Math.random() < 0.1) {
                    clearInterval(intv);
                    res();
                }
                if (count % 10 === 1) Beeper.beep(5);
                while (Math.random() < 0.2) {
                    const length = Math.floor(Math.random() * this.console.w);
                    this.console.print(times(length, () => 32));
                }
                const length = Math.floor(Math.random() * this.console.w);
                const randomString = times(length, () => Math.floor(Math.random() * 256));
                this.console.print(randomString);
            }, 200);
        });
    }
}