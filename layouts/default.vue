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
