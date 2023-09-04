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
export default {
    mounted () {
        this.$nuxt.$on('lenisCorner', this.cornerEvent);
        this.$nuxt.$on('lenisScroll', this.scrollEvent);
        const tl = this.gsap.timeline(
            {
                scrollTrigger: {
                    trigger: '.test',
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
        @include flex-center;
        height: 100vh;
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
}
</style>
