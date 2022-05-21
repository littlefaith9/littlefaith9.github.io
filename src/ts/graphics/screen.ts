import { fps, screenHeight, screenWidth, SECOND } from "../common/constants";
import { InputManager } from "../common/input";
import { distance, point } from "../common/utils";
import { ConIO } from "../programs/console/conio";
import { Console } from "../programs/console/console";
import { createCanvas } from "./canvasUtils";
import { SpriteBatch } from "./spriteBatch";
import { fontHeight, fontWidth } from "./spriteFont";

export class ScreenRenderer {
	canvas = createCanvas(screenWidth, screenHeight);
	console = new Console(screenWidth, screenHeight);
	input = new InputManager();
	conio = new ConIO(this.console, this.input);
	batch: SpriteBatch;
	lastDraw = 0;
	private centerButton?: HTMLButtonElement;
	private inputHelper?: HTMLInputElement;
	private touchStart = point(0, 0);
	private touchCurrent = point(100, 100);
	static inputDisabled = false;
	static scale = 1;
	static stretch = localStorage.getItem('stretch') !== '0';
	constructor() {
		this.canvas.id = 'canvas';
		this.canvas.style.userSelect = 'none';
		this.canvas.style.webkitUserSelect = 'none';
		// this.canvas.style.position = 'fixed';
		this.setTouch();
		document.body.appendChild(this.canvas);
		this.batch = new SpriteBatch(this.canvas);
		requestAnimationFrame(this.redraw.bind(this));
		this.resize();
		
		if (!DEVELOPMENT) {
			const hash = document.body.getAttribute('data-hash') || '';
			if (hash !== HASH) {
				ScreenRenderer.inputDisabled = true;
				this.conio.out('a newer version detected, updating...');
				setTimeout(() => location.reload(true), 3000);
				return;
			}
		}

		this.conio.out('littlefaith9.github.io [version ', VERSION, ']:').out(' Command Prompt').endl()
			.out(navigator.userAgent).out(' ').endl()
			.out(navigator.vendor).endl()
			.out('type \'help\' to see all commands').endl()
			.endl().out('A:\\>');
		this.conio.init();
	}
	get originScale() {
		return Math.max(1, (ScreenRenderer.stretch ? Math.min(window.innerWidth / screenWidth, window.innerHeight / screenHeight) : 1) * ScreenRenderer.scale);
	}
	private setTouch() {
		if (!isMobile) return;

		this.centerButton = document.createElement('button');
		this.centerButton.textContent = '↖';
		this.centerButton.style.backgroundColor = '#ffffff1f';
		this.centerButton.style.borderColor = '#ffffff2f';
		this.centerButton.style.color = '#ffffff2f';
		this.centerButton.style.borderRadius = '20px';
		this.centerButton.style.position= 'fixed';
		this.centerButton.style.bottom = '0';
		this.centerButton.style.right = '0';
		this.centerButton.style.margin = 'auto';
		this.centerButton.onclick = () => {
			window.scrollTo(0, 0);
		}
		document.body.appendChild(this.centerButton);
		this.centerButton.style.height = this.centerButton.clientWidth + 'px';

		this.inputHelper = document.createElement('input');
		this.inputHelper.type = 'text';
		this.inputHelper.autocapitalize = 'off';
		this.inputHelper.autocomplete = 'off';
		this.inputHelper.spellcheck = false;
		this.inputHelper.setAttribute('autocorrect', 'off');
		this.inputHelper.style.position = 'absolute';
		this.inputHelper.style.backgroundColor = 'transparent';
		this.inputHelper.style.color = 'transparent';
		this.inputHelper.style.borderColor = 'transparent';
		this.inputHelper.style.width = '0';
		this.inputHelper.style.caretColor = 'transparent';
		this.inputHelper.style.outline = 'none';
		document.body.appendChild(this.inputHelper);
		this.updateHelperPos();

		this.canvas.addEventListener('touchstart', ev => {
			this.touchCurrent.x = this.touchStart.x = ev.touches.item(0)?.clientX || 0;
			this.touchCurrent.y = this.touchStart.y = ev.touches.item(0)?.clientY || 0;
			// ev.preventDefault();
		});
		this.canvas.addEventListener('touchmove', ev => {
			this.touchCurrent.x = ev.touches.item(0)?.clientX || this.touchStart.x;
			this.touchCurrent.y = ev.touches.item(0)?.clientY || this.touchStart.y;
		})
		this.canvas.addEventListener('touchend', () => {
			const distanceN = distance(this.touchStart.x, this.touchStart.y, this.touchCurrent.x, this.touchCurrent.y)
			if (!ScreenRenderer.inputDisabled && distanceN < 15) {
				this.inputHelper?.focus();
			}
		});
	}
	updateHelperPos() {
		if (!isMobile) return;
		this.inputHelper!.value = '';
		this.inputHelper!.style.left = (this.console.currentPos.x * fontWidth).toString() + 'px';
		this.inputHelper!.style.top = (this.console.currentPos.y * fontHeight).toString() + 'px';
		window.scrollX = Math.max(0, window.scrollX);
		window.scrollY = Math.max(0, window.scrollY);
		// this.centerButton!.style.top = window.scrollY + 'px';
		// this.centerButton!.style.left = window.scrollX + 'px';
	}
	resize() {
		this.canvas.width = Math.floor(screenWidth * this.originScale);
		this.canvas.height = Math.floor(screenHeight * this.originScale);
	}
	redraw(now: number): any {
		if (now - this.lastDraw < SECOND / fps) {
			this.lastDraw = now;
			return requestAnimationFrame(this.redraw.bind(this));
		}
		if (this.canvas.width !== Math.floor(screenWidth * this.originScale) || this.canvas.height !== Math.floor(screenHeight * this.originScale)) {
			this.resize();
		}
		const top = Math.max(0, (window.innerHeight - this.canvas.height) / 2).toFixed(0) + 'px';
		if (this.canvas.style.marginTop !== top) {
			this.canvas.style.marginTop = top;
		}
		this.batch.start();
		this.batch.setSmoothing(false);
		this.batch.scale(this.originScale, this.originScale);
		this.batch.clear();
		this.console.draw(this.batch, now);
		this.batch.end();
		this.updateHelperPos();
		requestAnimationFrame(this.redraw.bind(this));
	}
}