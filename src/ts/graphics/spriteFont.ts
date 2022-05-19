import { Point, times2 } from "../common/utils";
import { createCanvas } from "./canvasUtils";

const padTop = 1;
const padLeft = 1;
export const fontWidth = 8;
export const fontHeight = 18;
const charPerLine = 16;
const charCounts = 256;

export const asciiChars = [
    '', '☺', '☻', '♥', '♦', '♣', '♠', '•', '◘', '○', '◙', '♂', '♀', '♪', '♫', '☼',
    '►', '◄', '↕', '‼', '¶', '§', '▬', '↨', '↑', '↓', '→', '←', '∟', '↔', '▲', '▼',
    ' ', '!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?',
    '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_',
    '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~', '⌂',
    'Ç', 'ü', 'é', 'â', 'ä', 'à', 'å', 'ç', 'ê', 'ë', 'è', 'ï', 'î', 'ì', 'Ä', 'Å',
    'É', 'æ', 'Æ', 'ô', 'ö', 'ò', 'û', 'ù', 'ÿ', 'Ö', 'Ü', '¢', '£', '¥', '₧', 'ƒ',
    'á', 'í', 'ó', 'ú', 'ñ', 'Ñ', 'ª', 'º', '¿', '⌐', '¬', '½', '¼', '¡', '«', '»',
    '░', '▒', '▓', '│', '┤', '╡', '╢', '╖', '╕', '╣', '║', '╗', '╝', '╜', '╛', '┐',
    '└', '┴', '┬', '├', '─', '┼', '╞', '╟', '╚', '╔', '╩', '╦', '╠', '═', '╬', '╧',
    '╨', '╤', '╥', '╙', '╘', '╒', '╓', '╫', '╪', '┘', '┌', '█', '▄', '▌', '▐', '▀',
    'α', 'ß', 'Γ', 'π', 'Σ', 'σ', 'µ', 'τ', 'Φ', 'Θ', 'Ω', 'δ', '∞', 'φ', 'ε', '∩',
    '≡', '±', '≥', '≤', '⌠', '⌡', '÷', '≈', '°', '∙', '⋅', '√', 'ⁿ', '²', '■', '\n',
];

export function getCharcode(char: string) {
    const index = asciiChars.indexOf(char.charAt(0));
    return index === -1 ? 63 : index;
}

// export const charOffsets = {
//     ...times(charCounts, i => getSpriteFontOffset(i)),
//     fromChar: (char: string) => getSpriteFontOffset(getCharcode(char)),
// };

export let fontSprites: { [charCode: number]: HTMLCanvasElement; (char: string): HTMLCanvasElement };
export let fontLoaded = false;

(async () => {
    const fontImage = document.createElement('img');
    fontImage.src = './assets/spritefont.png';

    await new Promise<void>(res => {
        const intv = setInterval(() => {
            if (fontImage.complete) {
                clearInterval(intv);
                res();
            }
        }, 500);
    })

    function getSpriteFontOffset(index: number): Point {
        return {
            x: padLeft + (index % charPerLine) * (padLeft + fontWidth),
            y: padTop + Math.floor(index / charPerLine) * (padTop + fontHeight) }
    }

    function createFontImage(offset: Point) {
        const canvas = createCanvas(fontWidth, fontHeight);
        canvas.getContext('2d')!.drawImage(fontImage, offset.x, offset.y, fontWidth, fontHeight, 0, 0, fontWidth, fontHeight);
        return canvas;
    }

    fontSprites = ((char: string) => fontSprites[getCharcode(char)]) as any;
    await times2(charCounts, i => fontSprites[i] = createFontImage(getSpriteFontOffset(i)));
    fontLoaded = true;
})();
