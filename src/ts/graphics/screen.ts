import { SECOND } from "../common/constants";
import { InputManager } from "../common/input";
import { ConIO } from "../programs/console/conio";
import { Console } from "../programs/console/console";
import { createCanvas } from "./canvasUtils";
import { SpriteBatch } from "./spriteBatch";

const screenWidth = 640;
const screenHeight = 480;
const fps = 24;

export class ScreenRenderer {
	canvas = createCanvas(screenWidth, screenHeight);
	console = new Console(screenWidth, screenHeight);
	input = new InputManager();
	conio = new ConIO(this.console, this.input);
	batch: SpriteBatch;
	lastDraw = 0;
	static scale = 1;
	constructor() {
		this.canvas.id = 'canvas';
		document.body.appendChild(this.canvas);
		this.batch = new SpriteBatch(this.canvas);
		requestAnimationFrame(this.redraw.bind(this));
		this.conio.out('littlefaith9.github.io [version ', VERSION, ']').endl().out('Command Prompt').endl().endl().out('A:\\>');
		this.conio.init();
	}
	resize() {
		this.canvas.width = screenWidth * ScreenRenderer.scale;
		this.canvas.height = screenHeight * ScreenRenderer.scale;
	}
	redraw(now: number): any {
		if (now - this.lastDraw < SECOND / fps) {
			this.lastDraw = now;
			return requestAnimationFrame(this.redraw.bind(this));
		}
		if (this.canvas.width !== screenWidth * ScreenRenderer.scale || this.canvas.height !== screenHeight * ScreenRenderer.scale) {
			this.resize();
		}
		this.batch.start();
		this.batch.setSmoothing(false);
		this.batch.scale(ScreenRenderer.scale, ScreenRenderer.scale);
		this.batch.clear();
		this.console.draw(this.batch, now);
		this.batch.end();
		requestAnimationFrame(this.redraw.bind(this));
	}
}