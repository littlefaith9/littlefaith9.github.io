import { ScreenRenderer } from "../graphics/screen";

document.body.style.margin = '0';
document.documentElement.style.backgroundColor = '#111';
(window as any).screen = new ScreenRenderer();