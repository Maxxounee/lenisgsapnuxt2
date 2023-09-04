<template>
    <div
        class="LenisScroll"
        v-touch="swipe"
        v-touch-options="{ swipeTolerance: swipeTolerance }"
        @wheel="wheelScroll"
    >
        <slot></slot>
    </div>
</template>

<script>
import Lenis from '@studio-freight/lenis';

export default {
    props: {
        swipeTolerance: {
            type: Number,
            default: 10,
        },
        easing: {
            type: String,
            default: 'default',
        },
        lerp: {
            type: Number,
            default: null,
        },
        duration: {
            type: Number,
            default: 0.8,
        },
        orientation: {
            type: String,
            default: 'vertical',
        },
        wheelDelay: {
            type: Number,
            default: 100,
        },
        cornerEventDelay: {
            type: Number,
            default: 900,
        },
        wheelMultiplier: {
            type: Number,
            default: 1,
        },
    },
    data () {
        return {
            corneredTime: null,
            magicAppleDeviceChecked: false,
            cornerEventEmitted: false,
            lenis: null,
            lastWheelDirection: null,
            easingDict: {
                default (x) {
                    return Math.min(1, 1.001 - Math.pow(2, -10 * x));
                },
                easeOutQuad (x) {
                    return 1 - (1 - x) * (1 - x);
                },
                easeInOutQuad (x) {
                    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
                },
                easeOutSine (x) {
                    return Math.sin((x * Math.PI) / 2);
                },
            },
        };
    },
    mounted () {
        this.lenis = this.getLenis();
        this.lenis.on('scroll', this.lenisScroll);
        requestAnimationFrame(this.raf);
    },
    beforeDestroy () {
        this.lenis = null;
    },
    methods: {
        getLenis (options) {
            let wheelMultiplier = this.wheelMultiplier;
            let duration = this.duration;
            if (options?.appleMagic) {
                wheelMultiplier /= 3;
                duration /= 5;
            }
            this.actualCornerEventDelay = this.cornerEventDelay;
            return new Lenis({
                lerp: this.lerp,
                easing: this.easingDict[this.easing],
                orientation: this.orientation,
                normalizeWheel: true,
                duration,
                wheelMultiplier,
            });
        },
        raf (time) {
            this.lenis.raf(time);
            requestAnimationFrame(this.raf);
        },
        lenisScroll (e) {
            this.$emit('scroll', e);
        },
        swipe (direction) {
            return;
            if (this.swipeEnabled) {
                if ((direction === 'left' && !this.swipeVertical) || (direction === 'top' && this.swipeVertical)) {
                    this.change({ delta: 1 });
                } else if ((direction === 'right' && !this.swipeVertical) || (direction === 'bottom' && this.swipeVertical)) {
                    this.change({ delta: -1 });
                }
            }
        },
        isMagicAppleDevice (e) {
            const isTouchPad = e.wheelDeltaY ? e.wheelDeltaY === -3 * e.deltaY : e.deltaMode === 0;
            return this.$device.isMacOS && isTouchPad;
        },
        setAppleMagicDeviceSettings (e) {
            if (this.isMagicAppleDevice(e)) {
                this.lenis = this.getLenis({ appleMagic: true });
                this.actualCornerEventDelay = this.cornerEventDelay + this.duration;
            }
            this.magicAppleDeviceChecked = true;
        },
        wheelScroll (e) {
            if (!this.magicAppleDeviceChecked) {
                this.setAppleMagicDeviceSettings(e);
            }

            const currentWheelDirection = e.deltaY > 0 ? 1 : -1;
            const cornerTermZero = this.lenis.progress < 0.002 && currentWheelDirection === -1;
            const cornerTermOne = this.lenis.progress > 0.998 && currentWheelDirection === 1;

            if (!this.corneredTime && (cornerTermZero || cornerTermOne)) {
                this.corneredTime = Date.now();
            }

            if (this.lastWheelDirection !== currentWheelDirection) {
                this.corneredTime = null;
            }

            this.lastWheelDirection = currentWheelDirection;

            if (this.corneredTime && (Date.now() - this.corneredTime > this.actualCornerEventDelay)) {
                if (!this.cornerEventEmitted && (cornerTermZero || cornerTermOne)) {
                    this.corneredTime = null;
                    this.$emit('corner', cornerTermOne ? 1 : 0);
                    this.cornerEventEmitted = true;
                    setTimeout(() => {
                        this.cornerEventEmitted = false;
                    }, this.actualCornerEventDelay * 2);
                }
            }
        },
    },
};
</script>

<style lang="scss">
html.lenis {
    height: auto;
}
.lenis.lenis-smooth {
    scroll-behavior: auto;
}
.lenis.lenis-smooth [data-lenis-prevent] {
    overscroll-behavior: contain;
}
.lenis.lenis-stopped {
    overflow: hidden;
}
.lenis.lenis-scrolling iframe {
    pointer-events: none;
}
</style>
