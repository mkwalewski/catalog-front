<template>
    <div>
        <button class="ladda-button" data-style="expand-left" @click="test"><span class="ladda-label">Submit</span></button>
    </div>
</template>

<script>
    import * as Ladda from 'ladda';

    export default {
        name: "Test",
        methods: {
            test: function () {
                let l = Ladda.create( document.querySelector( '.ladda-button' ) );
                l.start();
            }
        }
    }
</script>

<style scoped>

</style>
