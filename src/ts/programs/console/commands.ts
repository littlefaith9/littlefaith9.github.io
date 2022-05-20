import { ScreenRenderer } from "../../graphics/screen";
import { SpriteBatch } from "../../graphics/spriteBatch";
import { asciiChars } from "../../graphics/spriteFont";
import { Beeper } from "./beep";
import { Console } from "./console";
import { GlitchScreen } from "./glitchScreen";

interface Command {
    param: string;
    desc: string;
    handler: CommandHandler;
}
type CommandHandler = (message: string[], out: any, console: Console) => void | Promise<void>;

function command(name: string, param: string, desc: string, handler: CommandHandler) {
    return { [name]: { param, desc, handler } }
}

const commands: { [name: string]: Command } = {
    ...command('help', '(opt)<command>', 'show help message', (message, out) => {
        const comma = message[0] && commands[message[0]];
        if (!comma) out(Object.entries(commands).map(c => `${c[0]}${c[1].param ? ' ' + c[1].param : ''} - ${c[1].desc}`).join('\n') + '\n');
        else out(`${message[0]} - ${comma.desc}` + '\n');
    }),
    ...command('about', '', 'print about website', (_, out) => {
        const message = `                             ▓▓▓▓             
                            ▓██▓▓▓            
                     ▓▒▒▒▒▓▓████▓▓▓           
    ▓▓▓▓▓▓▓▒▓ ▓▓▒▒▒▒▒▒▒▒▒▒▒▓████▓▓▓           
        ▓▓▒▒▒▓▓▒▒▒▒▒▒▒▒▒▒▒▒▓████▓▓▓           
      ▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▓███▓▓▓▓           
       ▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░▒▓███▓▓▓▓           
         ▒▒▒▒▒▒▒▒▒▒▒▒░░▒▓▓▓▓▓▓▓▓▓▓▓           
         ▒▒▒▒▒▒▒▒▒▒░░░░▒▒▒▓▓▓▓▓▓▓▒▒▓          
         ▒▒▒▒▒▒▒▒▒░▒▓▒▓█▓▒▒▒▒▓▓▒▒▒▒▒▓         
         ▒░░░░▒▒░░▓██▓██▓░░▓▒▓▓▓▒▒▒▓          
        ▓▒░░░░░▒████████▓▒▒▓▓▓▓▒▒▒▒           
       ▓▒░░░░░▒▓████▓▓▓▓▓▓▓▓▓▓▒▒▒▒▓           
      ▓▒░░░▒▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒▓             
                 ▓▓▓▓▒▒░░░░░▒▒▓               
              ▓▒░░░▒▒▒░░░░░▒▒▒                
              ▓▒░░▒▒▒▒░░░░░▒▒▒▓               
               ▓░░░▒▒▒▒░░░░░▒▒▓               
Hello! It's Faith Donk.
The site is in development.
Stay tuned for more stuff!`;
        out(message + '\n');
    }),
    ...command('echo', '<message>', 'print message you typed', (message, out) => {
        out(message.join(' ') + '\n');
    }),
    ...command('cls', '', 'clear screen', (_, __, con) => {
        con.clear.call(con);
    }),
    ...command('color', '(optional)<BG/FG>', 'change colors', (message, out) => {
        function showHelp() {
            out('Sets the default command prompt forground and background colors\n\n');
            out('COLOR [attr]\n\n');
            out('  attr        Specifies color attribute of command prompt output\n\n');
            out('Color attributes are specified by TWO hex digits -- the first corresponds to the background; the second the forground. Each digit can be any of the following values:\n\n');
            out('    0 = Black       8 = Gray\n');
            out('    1 = Blue        9 = Light Blue\n');
            out('    2 = Green       A = Light Green\n');
            out('    3 = Aqua        B = Light Aqua\n');
            out('    4 = Red         C = Light Red\n');
            out('    5 = Purple      D = Light Purple\n');
            out('    6 = Yellow      E = Light Yellow\n');
            out('    7 = White       F = Light White\n\n');
            out('If no argument is given, this command restores the color to what it was when command prompt started.\n\n');
            out('the COLOR command sets ERRORLEVEL to 1 if an attempt is made to execute the COLOR command with a foreground and background color that are the same.\n\n');
            out('Example: "COLOR fc" produces light red on bright white\n');
        }
        if (!message[0]) {
            SpriteBatch.colorBG = 0x0;
            SpriteBatch.colorFG = 0x7;
            return;
        }
        if (message[0][0] && message[0][1]) {
            const colorFG = parseInt(message[0][1], 16);
            const colorBG = parseInt(message[0][0], 16);
            if (colorFG === colorBG) return showHelp();
            if (!colorFG || colorFG < 0 || colorFG > 15) return showHelp();
            if (!colorBG || colorBG < 0 || colorBG > 15) return showHelp();
            SpriteBatch.colorFG = colorFG;
            SpriteBatch.colorBG = colorBG;
        }
    }),
    ...command('scale', '<number>', 'set scale', (message) => {
        const scale = parseInt(message[0]);
        if (!message[0] || !scale) ScreenRenderer.scale = ScreenRenderer.scale % 2 + 1;
        else ScreenRenderer.scale = scale;
    }),
    ...command('beep', '<second>', 'make beep sound', (message) => {
        const second = parseInt(message[0]) || 1;
        Beeper.beep(second);
    }),
    ...command('gui', '', '[WIP?]Graphic User Interface', (_, __, con) => new GlitchScreen(con).run())
};

export async function handleCommands(messageBuffer: Uint8Array, out: any, con: Console) {
    let message = '';
    for (let code of Array.from(messageBuffer)) {
        if (code === 0) break;
        message += asciiChars[code];
    }
    const separate = message.split(' ');
    const command = commands[separate.shift() || ''];
    if (!command) {
        out('Bad command or file name' + '\n');
        if (DEVELOPMENT) console.log(messageBuffer);
    } else await command.handler(separate, out, con);
}
