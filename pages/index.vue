<template>
    <div class="index">
        <LenisScroll
            @scroll="scroll"
            @cornerEvent="cornerEvent"
        >
            <div class="test">
                <h1 class="title">AWESOOOOOOOME</h1>
                <!--                <h1 class="title1">AWESOMEANIMATION</h1>-->
            </div>
            <div class="test_2">
            </div>
            <div class="test_2">
            </div>
            <div class="test_2">
            </div>
            <div class="test_2">
            </div>
            <!--            <div class="test">-->
            <!--            </div>-->
            <!--            <div class="test">-->
            <!--            </div>-->
        </LenisScroll>
    </div>
</template>

<script>
import LenisScroll from '@/components/LenisScroll.vue';

export default {
    components: {
        LenisScroll,
    },
    mounted () {
        // console.log(this.ScrollTrigger);
        // this.gsap.ScrollTrigger;
        console.log(this.gsap);
        const tl = this.gsap.timeline(
            {
                scrollTrigger: {
                    trigger: '.test',
                    // x: 300,
                    // scrollTrigger: '.test2',
                    start: 'center center',
                    end: 'bottom center',
                    pin: '.test',
                    scrub: true,
                    markers: true,
                },
            },
        );
        tl.to('.title', {
            x: 166,
            // y: 100,
            scale: 100,
            opacity: 0,
            ease: false,
        });
    },
    methods: {
        scroll (e) {
            // console.log('index', e);
        },
        cornerEvent (e) {
            // console.log('corner', e);
        },
    },
};
</script>

<style lang="scss">
@import "@/assets/style/import.scss";
.index {
    .test {
        height: 100vh;
        @include flex-center;
        background-color: $GREEN;
        width: 100vw;
        &_2 {
            height: 100vh;
            width: 100vw;
            background-color: darkslateblue;
        }
    }
    .title {
        @include font-m;
    }
    .end {
        height: 10px;
        background-color: darkslateblue;
        width: 100%;
    }
}
</style>
