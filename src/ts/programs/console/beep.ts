export class Beeper {
	private static context?: AudioContext;
    private static oscillator?: OscillatorNode;
	private static createOscillator(frequency: number, type: OscillatorType) {
        this.context = this.context || new AudioContext();
		const oscillator = this.context.createOscillator();
		oscillator.type = type;
		oscillator.frequency.value = frequency;
        oscillator.connect(this.context.destination);

		return oscillator;
	}
	static beep(duration: number, frequency = 800, type: OscillatorType = 'triangle') {
        try { this.oscillator?.stop(this.context!.currentTime); } catch (e) {}
		this.oscillator = this.createOscillator(frequency, type);
		const now = this.context!.currentTime;
		this.oscillator.start(now);
		this.oscillator.stop(now + duration);
	}
    static stop() {
        try { this.oscillator?.stop(this.context!.currentTime) } catch (e) {}
    }
}