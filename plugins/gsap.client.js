import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Vue from 'vue';

gsap.registerPlugin(ScrollTrigger);
Vue.mixin({
	created () {
		this.gsap = gsap;
	},
});

