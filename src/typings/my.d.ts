declare const DEVELOPMENT: boolean;
declare const VERSION: string;
declare const HASH: string;
declare const isMobile: boolean;

interface Location {
	reload(hardReload?: boolean): void;
}
