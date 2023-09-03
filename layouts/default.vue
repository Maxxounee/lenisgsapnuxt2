<template>
    <div class="default">
        <LenisScroll
            @corner="lenisCorner"
            @scroll="lenisScroll"
        >
            <Nuxt/>
        </LenisScroll>
    </div>
</template>

<script>
export default {
    mounted () {
    },
    methods: {
        test (e) {
            console.log('test12313131323123');
            // console.log(e)
            console.log();
        },
        lenisScroll (e) {
            this.$nuxt.$emit('lenisScroll', e);
        },
        lenisCorner (e) {
            this.$nuxt.$emit('lenisCorner', e);
        },
    },
};
</script>

<style lang="scss">
.default {
}
</style>
