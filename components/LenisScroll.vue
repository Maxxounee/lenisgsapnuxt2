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
    components: {
        // [process.client && 'device']: () => import('current-device'),
    },
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
    watch: {
        'process.client': {
            handler (value) {
                console.log('process', value);
            },
        },
    },
    data () {
        return {
            scrollValue: null,
            corneredTime: null,
            reachedCorner: null,
            magicAppleDeviceChecked: false,
            cornerEventEmitted: false,
            lenis: null,
            scrollStartTime: null,
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
                duration /= 2;
            }
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
            console.log('lenisScroll');
            this.scrollValue = this.lenis.progress;
            this.$emit('scroll', e);
            this.$nuxt.$emit('scroll', e);
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
        wheelScroll (e) {
            if (!this.scrollValue) {
                this.scrollValue = this.lenis.progress;
            }
            if (!this.magicAppleDeviceChecked && this.isMagicAppleDevice(e)) {
                this.lenis = this.getLenis({ appleMagic: true });
            }
            this.magicAppleDeviceChecked = true;

            const currentWheelDirection = e.deltaY > 0 ? 1 : -1;
            const cornerTermZero = this.scrollValue < 0.001 && currentWheelDirection === -1;
            const cornerTermOne = this.scrollValue > 0.999 && currentWheelDirection === 1;
            if (!this.corneredTime && (cornerTermZero || cornerTermOne)) {
                this.reachedCorner = this.scrollValue;
                this.corneredTime = Date.now();
            }

            if (this.lastWheelDirection !== currentWheelDirection) {
                this.corneredTime = null;
            }

            this.lastWheelDirection = currentWheelDirection;
            if (this.corneredTime && (Date.now() - this.corneredTime > this.cornerEventDelay)) {
                if (!this.cornerEventEmitted && (cornerTermZero || cornerTermOne)) {
                    this.$emit('corner', cornerTermOne ? 1 : 0);
                    this.corneredTime = null;
                    this.cornerEventEmitted = true;
                    setTimeout(() => {
                        this.cornerEventEmitted = false;
                    }, this.cornerEventDelay * 2);
                }
            }
        },
    },
};
</script>

<style lang="scss">
.LenisScroll {
    //height: auto;
    //height: 100vh;
    //overflow-y: scroll;
}
.lenis.lenis-smooth {
    scroll-behavior: auto;
}
.lenis.lenis-smooth [data-lenis-prevent] {
    overscroll-behavior: contain;
}
.lenis.lenis-stopped {
    //overflow: hidden;
}
.lenis.lenis-scrolling iframe {
    pointer-events: none;
}
</style>
