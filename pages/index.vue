<template>
    <div class="page index">
        <div class="test">
            <h1 class="title">AWESOOOOOOOME</h1>
        </div>
        <div class="test_2">
        </div>
        <div class="test_2">
        </div>
        <div class="test_2">
        </div>
        <div class="test_2">
        </div>
    </div>
</template>

<script>
import LenisScroll from '@/components/LenisScroll.vue';

export default {
    components: {
        LenisScroll,
    },
    mounted () {
        this.$nuxt.$on('lenisCorner', this.cornerEvent);
        this.$nuxt.$on('lenisScroll', this.scrollEvent);
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
        scrollEvent (e) {
            console.group('%cLENIS SCROLL', 'color: #2F4F4F');
            console.log('lenisScroll Emitted! --->');
            console.log(e);
            console.groupEnd();
        },
        cornerEvent (e) {
            console.group('%cLENIS CORNER', 'color: #FFE4B5');
            console.log('lenisCorner Emitted! --->');
            console.log(e);
            console.groupEnd();
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
