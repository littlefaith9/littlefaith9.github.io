import { asciiChars } from "../../graphics/spriteFont";
import { Console } from "./console";

interface Command {
    param: string;
    desc: string;
    handler: CommandHandler;
}
type CommandHandler = (message: string[], out: any, console: Console) => void;

function command(name: string, param: string, desc: string, handler: CommandHandler) {
    return { [name]: { param, desc, handler } }
}

const commands: { [name: string]: Command } = {
    ...command('help', '(opt)<command>', 'show help message', (message, out) => {
        const comma = message[0] && commands[message[0]];
        if (!comma) out(Object.entries(commands).map(c => `${c[0]} - ${c[1].desc}`).join('\n'));
        else out(`${message[0]} - ${comma.desc}`);
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
        out(message);
    }),
    ...command('echo', '<message>', 'print message you typed', (message, out) => {
        out(message.join(' '));
    }),
    ...command('cls', '', 'clear screen', (_, __, con) => {
        con.clear.call(con);
    })
};

export function handleCommands(messageBuffer: Uint8Array, out: any, con: Console) {
    let message = '';
    for (let code of Array.from(messageBuffer)) {
        if (code === 0) break;
        message += asciiChars[code];
    }
    const separate = message.split(' ');
    const command = commands[separate.shift() || ''];
    if (!command) {
        out('Bad command or file name');
        if (DEVELOPMENT) console.log(messageBuffer);
    } else command.handler(separate, out, con);
}
