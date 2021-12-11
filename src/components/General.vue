<template>
    <div class="my-3">
        <div class="px-2 px-sm-0">
            <h3 class="m-0">General</h3>
        </div>
        <hr class="m-0"/>
        <BusMessages v-bind:updateSuccessAlert="updateSuccessAlert" />

        <!--        <p>Background Color:</p>-->
        <!--        <p>Font Color:</p>-->
        <!--        <p>Show daily message as alert</p>-->
    </div>
</template>

<script>
    import BusMessages from "./BusMessages";
    export default {
        name: "General",
        components: {
            BusMessages
        },
        props: {
            updateSuccessAlert: Function
        }
    }
</script>

<style scoped>

</style>