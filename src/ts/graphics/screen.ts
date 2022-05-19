import { Console } from "../programs/console/console";
import { createCanvas } from "./canvasUtils";
import { SpriteBatch } from "./spriteBatch";

const screenWidth = 640;
const screenHeight = 480;

const drawing = `                             ▓▓▓▓             
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
The site is under construction.
Stay tuned!`;

class ScreenRenderer {
	canvas = createCanvas(screenWidth, screenHeight);
	console = new Console(screenWidth, screenHeight);
	batch: SpriteBatch;
	constructor() {
		this.canvas.id = 'canvas';
		document.body.appendChild(this.canvas);
		this.batch = new SpriteBatch(this.canvas);
		requestAnimationFrame(this.redraw.bind(this));
		this.console.print(drawing)
		// window.addEventListener('resize', this.resizeCanvas.bind(this));
	}
	// resizeCanvas() {
	// 	const scale = this.getScale();
	// 	this.canvas.width = screenWidth * scale;
	// 	this.canvas.height = screenHeight * scale;
	// }
	// getScale() {
	// 	return Math.min(window.innerWidth / screenWidth, window.innerHeight / screenHeight);
	// }
	redraw(now: number) {
		// const scale = this.getScale();
		this.batch.start();
		// this.batch.setSmoothing(false);
		// this.batch.scale(scale, scale);
		this.batch.clear();
		this.console.draw(this.batch, now);
		this.batch.end();
		requestAnimationFrame(this.redraw.bind(this));
	}
}
(window as any).screen = new ScreenRenderer();