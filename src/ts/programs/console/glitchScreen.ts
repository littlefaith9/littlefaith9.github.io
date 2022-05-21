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
        this.console.print('starting GUI...');
        await new Promise(res => setTimeout(res, 1000))
    }
    private glitch() {
        return new Promise<void>(res => {
            const intv = setInterval(() => {
                if (!this.running) {
                    clearInterval(intv);
                    res();
                }
                const length = Math.floor(Math.random() * this.console.w);
                const randomString = times(length, () => Math.floor(Math.random() * 256));
                Beeper.beep(1);
                this.console.posIndex = this.console.w * this.console.h - 1;
                this.console.print(randomString);
            }, 500);
        });
    }
}