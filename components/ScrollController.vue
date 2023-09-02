<template>
	<div class="ScrollController" @wheel="scrollEvent">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'ScrollController',
	props: {
		start: {
			type: Number,
			default: 0,
		},
		min: {
			type: Number,
			default: 0,
		},
		max: {
			type: Number,
			default: 100,
		},
		cycle: {
			type: Boolean,
			default: true,
		},
		duration: {
			type: Number,
			default: 1000,
		},
		scrollEnabled: {
			type: Boolean,
			default: true,
		},
		scrollSpeed: {
			type: Number,
			default: 1,
		},
		scrollDelta: {
			type: Number,
			default: 0,
		},
		scrollCornerDelay: {
			type: Number,
			default: 500,
		},
		panEnabled: {
			type: Boolean,
			default: true,
		},
		panSpeed: {
			type: Number,
			default: 1,
		},
		panDecaySpeed: {
			type: Number,
			default: 2,
		},
		panVertical: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			valueActive: 0,
			valueFinal: this.start,
			deltas: [],
			callbackSend: true,
			cornerEventParams: null,
			nextStep: false,
			hammer: null,
			parentSize: null,
			mounted: false,
		};
	},
	computed: {
		mountedAndPanEnabled() {
			return this.mounted && this.panEnabled;
		},
	},
	watch: {
		mountedAndPanEnabled: {
			handler(value) {
				if (value) {
					this.hammer = new this.$Hammer(this.$el);
					this.hammer
						.on('panstart', (e) => {
							this.stop();
							this.parentSize = this.$el.offsetParent[this.panVertical ? 'offsetHeight' : 'offsetWidth'];
						})
						.on('panmove', (e) => {
							this.calc(this.panEvent(e));
						})
						.on('panend', (e) => {
							this.valueActive += this.panEvent(e);
							const target = -1 * this.panSpeed * this.panDecaySpeed * (this.panVertical ? e.velocityY * 1080 / window.innerHeight : e.velocityX * 1920 / window.innerWidth);
							requestAnimationFrame(this.startAnim(target, this.duration));
						})
						.get('pan').set({
							threshold: 0,
							direction: [
								Hammer.DIRECTION_VERTICAL,
								Hammer.DIRECTION_HORIZONTAL,
							][Number(this.panVertical)],
						});
				} else
				if (this.hammer) {
					this.hammer.destroy();
				}
			},
			immediate: true,
		},
	},
	mounted() {
		this.mounted = true;
	},
	beforeDestroy() {
		if (this.hammer) {
			this.hammer.destroy();
		}
	},
	methods: {
		scrollEvent(e) {
			if (this.scrollEnabled && Math.abs(e.deltaY) >= this.scrollDelta) {
				requestAnimationFrame(this.startAnim(e.deltaY * this.scrollSpeed / 100, this.duration));
			}
		},
		panEvent(e) {
			return -75 * this.panSpeed * e[this.panVertical ? 'deltaY' : 'deltaX'] / this.parentSize;
		},
		cornerEvent(val, direction, now) {
			/* BUG: direction вместо value - фикс бага при скроле жестами. */
			const value = this.deltas[this.deltas.length - 1]?.value ?? direction;
			if (this.callbackSend || !this.cornerEventParams) {
				this.cornerEventParams = [value * 0.5, now + this.scrollCornerDelay];
			} else
			if (now >= this.cornerEventParams[1]) {
				if ((value < 0 && value <= this.cornerEventParams[0]) || (value > 0 && value >= this.cornerEventParams[0])) {
					this.$emit('cornerEventDelay', direction);
					this.cornerEventParams = null;
				}
			}
			this.valueActive = val - this.start;
			this.valueFinal = val;
			if (this.callbackSend) {
				this.$emit('changeEvent', this.valueFinal);
				this.$emit('cornerEvent', direction);
			}
			this.callbackSend = false;
			this.deltas = [];
			this.nextStep = false;
		},
		calcValueFinal(valueTemp) {
			this.valueFinal = this.start + this.valueActive + valueTemp;
		},
		startAnim(value, duration, easing, cb) {
			return (start) => {
				this.deltas.push({
					value,
					start,
					duration,
					easing: easing || $.easing.easeOutQuart,
					cb,
					valueTemp: 0,
				});
				if (this.deltas.length === 1) {
					this.draw(start);
				}
			};
		},
		draw(now) {
			this.nextStep = false;
			let valueTemp = 0;
			this.deltas.forEach((item, key) => {
				const progress = (now - item.start) / item.duration;
				if (progress >= 1) {
					item.delete = true;
					this.valueActive += item.value;
					if (item.cb) {
						item.cb();
					}
				} else {
					this.nextStep = true;
					item.valueTemp = item.value * item.easing(progress);
					valueTemp += item.valueTemp;
				}
			});
			if (!this.nextStep || valueTemp) {
				this.calc(valueTemp, now);
			}
			this.deltas = this.deltas.filter((item) => !item.delete);
			if (this.nextStep) {
				requestAnimationFrame(this.draw);
			}
		},
		calc(value, now) {
			this.calcValueFinal(value);
			if (!this.cycle) {
				if (this.valueFinal <= this.min) {
					this.cornerEvent(this.min, -1, now);
				} else
				if (this.valueFinal >= this.max) {
					this.cornerEvent(this.max, 1, now);
				} else {
					this.callbackSend = true;
					this.$emit('changeEvent', this.valueFinal);
				}
			} else {
				if (this.valueFinal < this.min) {
					this.valueActive += this.max - this.min;
					this.calcValueFinal(value);
				} else
				if (this.valueFinal >= this.max) {
					this.valueActive -= this.max - this.min;
					this.calcValueFinal(value);
				}
				this.$emit('changeEvent', this.valueFinal);
			}
		},
		stop() {
			this.deltas.forEach((item, key) => {
				this.valueActive += item.valueTemp;
			});
			this.deltas = [];
		},
		moveTo(opt) {
			this.stop();
			let delta = opt.target - this.valueActive;
			if (this.cycle) {
				const distances = [delta, delta - this.min + this.max, delta + this.min - this.max];
				const distancesAbs = distances.map((item) => Math.abs(item));
				delta = distances[distancesAbs.indexOf(Math.min.apply(null, distancesAbs))];
			}
			let duration = opt.duration || 0;
			if (opt.speed !== undefined) {
				duration = opt.speed * Math.abs(delta);
			}
			requestAnimationFrame(this.startAnim(delta, duration, opt.easing || $.easing.easeOutQuad, opt.cb));
		},
	},
};
</script>
