<template>
    <div
        v-touch="swipe"
        v-touch-options="{ swipeTolerance: 0 }"
        class="EventsController"
        :class="[`EventsController-state-${current}`, { 'EventsController-disabled': disabled, 'EventsController-enabled': enabled }]"
        @wheel="scrollEvent"
    >
        <slot></slot>
        <template v-if="!disabled">
            <template v-if="buttons">
                <div class="EventsController_btn EventsController_btn-prev" :class="{ 'EventsController_btn-active': current !== min }" @click="change({ delta: -1 })">
                    <slot name="btn-prev"></slot>
                </div>
                <div class="EventsController_btn EventsController_btn-next" :class="{ 'EventsController_btn-active': current !== max }" @click="change({ delta: 1 })">
                    <slot name="btn-next"></slot>
                </div>
            </template>
            <div v-if="numbers" class="EventsController_numbers" v-html="numbersTemplate(current + 1, max + 1)"></div>
            <div v-if="dots" class="EventsController_dots">
                <div
                    v-for="(dot, dot_id) in dotsList"
                    :key="dot_id"
                    class="EventsController_dot"
                    :class="{ 'EventsController_dot-active': dot === current }"
                    @click="change({ target: dot })"
                ></div>
            </div>
        </template>
    </div>
</template>

<script>
import Vue from 'vue';
import Vue2TouchEvents from 'vue2-touch-events';
Vue.use(Vue2TouchEvents);

export default {
    name: 'EventsController',
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
            default: 5,
        },
        cycle: {
            type: Boolean,
            default: false,
        },
        enabled: {
            type: Boolean,
            default: true,
        },
        buttons: {
            type: Boolean,
            default: false,
        },
        numbers: {
            type: [Boolean, Function],
            default: false,
        },
        swipeEnabled: {
            type: Boolean,
            default: false,
        },
        swipeVertical: {
            type: Boolean,
            default: false,
        },
        scrollEnabled: {
            type: Boolean,
            default: true,
        },
        scrollTimeout: {
            type: Number,
            default: 500,
        },
        scrollDelta: {
            type: Number,
            default: 10,
        },
        dots: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            current: this.start,
            hammer: null,
            scrollDelay: null,
        };
    },
    computed: {
        dotsList() {
            const arr = [];
            for (let i = this.min; i <= this.max; i++) {
                arr.push(i);
            }
            return arr;
        },
        disabled() {
            return this.min >= this.max;
        },
    },
    methods: {
        change(opt) {
            if (this.enabled || opt.forced) {
                let currentNext, direction;
                if (opt.delta) {
                    currentNext = this.validateCurrent(this.current + opt.delta, true);
                    direction = opt.delta > 0 ? 1 : -1;
                } else
                if (opt.target !== undefined) {
                    currentNext = this.validateCurrent(opt.target, false);
                    direction = currentNext > this.current ? 1 : -1;
                }
                if (currentNext !== undefined) {
                    // console.log('12312332132')
                    this.$emit('test')
                    if (currentNext !== this.current) {
                        this.current = currentNext;
                        this.$emit('changeEvent', this.current, direction);
                    } else
                    if (!this.cycle) {
                        this.$emit('cornerEvent', direction);
                    }
                }
            }
        },
        validateCurrent(value, skip) {
            if (value > this.max) {
                if (skip && this.cycle) {
                    return this.min;
                }
                return this.max;
            }
            if (value < this.min) {
                if (skip && this.cycle) {
                    return this.max;
                }
                return this.min;
            }
            return value;
        },
        numbersTemplate(current, total) {
            if (typeof this.numbers === 'function') {
                return this.numbers(current, total);
            }
            return `
				<div class="EventsController_numbers_current">${this.$addZero(current)}</div>
				<div class="EventsController_numbers_spacer"></div>
				<div class="EventsController_numbers_total">${this.$addZero(total)}</div>`;
        },
        scrollEvent(e) {
            console.log('scroll')
            if (this.scrollEnabled && !this.scrollDelay && Math.abs(e.deltaY) >= this.scrollDelta) {
                this.scrollDelay = setTimeout(() => {
                    this.scrollDelay = null;
                }, this.scrollTimeout);
                this.change({ delta: e.deltaY > 0 ? 1 : -1 });
            }
        },
        setCurrent(value) {
            this.current = this.validateCurrent(value, false);
        },
        swipe(direction) {
            console.log('swipe')
            if (this.swipeEnabled) {
                if ((direction === 'left' && !this.swipeVertical) || (direction === 'top' && this.swipeVertical)) {
                    this.change({ delta: 1 });
                } else
                if ((direction === 'right' && !this.swipeVertical) || (direction === 'bottom' && this.swipeVertical)) {
                    this.change({ delta: -1 });
                }
            }
        },
    },
};
</script>

<style lang="scss">
.EventsController {
    &_btn {
        position: absolute;
        top: 0;
        left: 0;
        width: 50%;
        height: 100%;
        cursor: pointer;
        &-next {
            left: auto;
            right: 0;
        }
    }
    &_numbers,
    &_dots {
        position: absolute;
        left: 50%;
        bottom: 5rem;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
    }
    &_numbers {
        background-color: #fff;
        height: 3rem;
        &_current,
        &_total {
            width: 4rem;
            text-align: center;
        }
        &_spacer {
            height: 0.1rem;
            width: 2rem;
            background-color: #000;
        }
    }
    &_dot {
        width: 3rem;
        height: 3rem;
        cursor: pointer;
        position: relative;
        &:after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 1rem;
            height: 1rem;
            margin: -0.5rem;
            background-color: #0f0;
        }
        &-active {
            cursor: default;
            &:after {
                background-color: #f00;
            }
        }
    }
}
</style>
