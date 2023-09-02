<template>
    <div class="index">
        <LenisScroll>
            <div class="test"></div>
            <div class="test"></div>
            <div class="test test_2"></div>

            <div class="test"></div>
            <div class="end"></div>
            <div class="end"></div>
        </LenisScroll>
    </div>
</template>

<script>
import EventsController from "@/components/EventsController.vue";
export default {
    components: { EventsController },
    methods: {
        test(e) {
            // console.log('corner')
        },
    },
}
</script>

<style lang="scss">

.index {
    .test {
        height: 100vh;
        background-color: red;
        width: 100vh;
        &_2 {
            background-color: darkslateblue;
        }
    }
    .end {
        height: 10px;
        background-color: darkslateblue;
        width: 100%;
    }
}
</style>
