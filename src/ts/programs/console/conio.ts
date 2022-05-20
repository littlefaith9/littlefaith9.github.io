import { InputManager, Key } from "../../common/input";
import { times } from "../../common/utils";
import { asciiChars } from "../../graphics/spriteFont";
import { handleCommands } from "./commands";
import { Console } from "./console";

function setHandlers(this: ConIO, fromCharTyping: (key: Key, typing: [number, number]) => void,
    handler: (key: Key, handler: () => void) => void) {
    times(26, i => fromCharTyping(Key.KEY_A + i, [ Key.KEY_A + i, Key.KEY_A + i + 32 ]));
	fromCharTyping(Key.ENTER, [ 255, 255 ]);
	fromCharTyping(Key.SPACE, [ 32, 32 ]);
	fromCharTyping(Key.KEY_0, [ 41, 48 ]);
	fromCharTyping(Key.KEY_1, [ 33, 49 ]);
	fromCharTyping(Key.KEY_2, [ 64, 50 ]);
	fromCharTyping(Key.KEY_3, [ 35, 51 ]);
	fromCharTyping(Key.KEY_4, [ 36, 52 ]);
	fromCharTyping(Key.KEY_5, [ 37, 53 ]);
	fromCharTyping(Key.KEY_6, [ 94, 54 ]);
	fromCharTyping(Key.KEY_7, [ 38, 55 ]);
	fromCharTyping(Key.KEY_8, [ 42, 56 ]);
	fromCharTyping(Key.KEY_9, [ 40, 57 ]);
	fromCharTyping(Key.NUMPAD_0, [ 48, 48 ]);
	fromCharTyping(Key.NUMPAD_1, [ 49, 49 ]);
	fromCharTyping(Key.NUMPAD_2, [ 50, 50 ]);
	fromCharTyping(Key.NUMPAD_3, [ 51, 51 ]);
	fromCharTyping(Key.NUMPAD_4, [ 52, 52 ]);
	fromCharTyping(Key.NUMPAD_5, [ 53, 53 ]);
	fromCharTyping(Key.NUMPAD_6, [ 54, 54 ]);
	fromCharTyping(Key.NUMPAD_7, [ 55, 55 ]);
	fromCharTyping(Key.NUMPAD_8, [ 56, 56 ]);
	fromCharTyping(Key.NUMPAD_9, [ 57, 57 ]);
	fromCharTyping(Key.MULTIPLY, [ 42, 42 ]);
	fromCharTyping(Key.ADD, [ 43, 43 ]);
	fromCharTyping(Key.SUBTRACT, [ 45, 54 ]);
	fromCharTyping(Key.DECIMAL, [ 46, 46 ]);
	fromCharTyping(Key.DIVIDE, [ 47, 47 ]);
	fromCharTyping(Key.SEMICOLON, [ 58, 59 ]);
	fromCharTyping(Key.EQUALS, [ 43, 61 ]);
	fromCharTyping(Key.COMMA, [ 44, 60 ]);
	fromCharTyping(Key.DASH, [ 95, 45 ]);
	fromCharTyping(Key.PERIOD, [ 62, 46 ]);
	fromCharTyping(Key.FORWARD_SLASH, [ 63, 47 ]);
	fromCharTyping(Key.GRAVE_ACCENT, [ 126, 96 ]);
	fromCharTyping(Key.OPEN_BRACKET, [ 123, 91 ]);
	fromCharTyping(Key.BACK_SLASH, [ 124, 92 ]);
	fromCharTyping(Key.CLOSE_BRACKET, [ 125, 93 ]);
	fromCharTyping(Key.SINGLE_QUOTE, [ 34, 39 ]);
    handler(Key.BACKSPACE, this.backspace.bind(this));
    handler(Key.LEFT, this.backspace.bind(this));
}

export class ConIO {
    inBuffer = new Uint8Array(256);
    bufferPos = 0;
    constructor (private console: Console, private input: InputManager) { }
    private handlerFromCharTyping(key: Key, typing: [number, number]) {
        this.input.onPressed(key, () => {
            if (this.input.shift) this.handleInput(typing[0]);
            else this.handleInput(typing[1]);
        })
    }
    private handleInput(charCode: number) {
        this.console.print(asciiChars[charCode]);
        if (charCode === 255) {
            handleCommands(this.inBuffer, this.out.bind(this), this.console);
            this.inBuffer.fill(0);
            this.bufferPos = 0;
            if (this.console.posIndex > 0) this.endl().endl();
            this.out('A:\\>');
        }
        else this.inBuffer[this.bufferPos++] = charCode;
    }
    // private createHandler(key: Key, handler: () => void) {
    //     this.input.onPressed(key, handler);
    // }
    public backspace() {
        if (this.bufferPos === 0) return;
        this.console.buffer[--this.console.posIndex] = 0;
        this.inBuffer[--this.bufferPos] = 0;
    }
    public out(...message: any[]) {
        message.forEach(m => this.console.print(`${m}`))
        return this;
    }
    public endl() {
        this.console.endl();
        return this;
    }
    public init() {
        setHandlers.call(this, this.handlerFromCharTyping.bind(this), this.input.onPressed.bind(this.input));
    }
}