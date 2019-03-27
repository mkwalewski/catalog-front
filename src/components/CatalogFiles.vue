<template>
    <div>
        <template v-if="filesIsLoading">
            <div class="m-xxs progress-ring progress-large">
                <div class="progress-circle"></div>
                <div class="progress-circle"></div>
                <div class="progress-circle"></div>
                <div class="progress-circle"></div>
                <div class="progress-circle"></div>
            </div>
        </template>
        <template v-else-if="catalogFiles.length > 0">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th class="text-center">Lp.</th>
                        <th class="text-center">Typ</th>
                        <th class="text-center">Miniaturka</th>
                        <th class="text-left">Plik</th>
                        <th class="text-center">Rozszerzenie</th>
                        <th class="text-center">Rozmiar</th>
                        <th class="text-center">Długość</th>
                        <th class="text-center">Rozdzielczość</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(file,key) in catalogFiles" :key="key">
                        <td>
                            {{ key + 1 }}
                        </td>
                        <td class="file-type">
                            {{ file.type }}
                        </td>
                        <td>
                            <template v-if="file.image">
                                <img v-img class="thumb" :src="SERVER + file.image" />
                            </template>
                        </td>
                        <td class="text-left"  style="max-width: 500px;">
                            {{ file.filename }}.{{ file.extension }}<br/>
                            <span class="text-muted">{{ file.folder }}</span>
                        </td>
                        <td>
                            {{ file.extension | upper }}
                        </td>
                        <td>
                            <template v-if="file.size">
                                {{ file.sizeFormatted }}
                            </template>
                        </td>
                        <td>
                            <template v-if="file.length">
                                {{ file.lengthFormatted }}
                            </template>
                        </td>
                        <td>
                            <template v-if="file.videoWidth && file.videoHeight">
                                {{ file.videoWidth }}x{{ file.videoHeight }}
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </template>
        <!--
        <table class="table table-striped">
            <thead>
            <tr>
                <th class="text-center">Lp.</th>
                <th class="text-center">Typ</th>
                <th class="text-center">Miniaturka</th>
                <th class="text-left">Plik</th>
                <th class="text-center">Rozszerzenie</th>
                <th class="text-center">Długość</th>
                <th class="text-center">Rozdzielczość</th>
                <th class="text-center">Rozmiar</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(file,key) in catalogFiles" :key="key">
                <td>
                    {{ key + 1 }}
                </td>
                <td class="text-center">
                    <img :src="SERVER + '/icons/' + file.type + '.png'" />
                </td>
                <td class="text-center">
                    <template v-if="file.md5">
                        <img v-img :src="SERVER + '/thumbs/' + file.id + '.jpg'" style="max-height: 15px;" @click="open(file,'file')" />
                    </template>
                </td>
                <td class="text-left"  style="max-width: 500px;">
                    {{ file.filename }}.{{ file.extension }}<br/>
                    <span class="text-muted">{{ file.folder }}</span>
                </td>
                <td>{{ file.extension | upper }}</td>
                <td>
                    <template v-if="file.length">
                        {{ file.lengthFormatted }}
                    </template>
                </td>
                <td>
                    <template v-if="file.md5 && file.videoWidth && file.videoHeight">
                        {{ file.videoWidth }}x{{ file.videoHeight }}
                    </template>
                    <template v-if="file.md5 && file.imageWidth && file.imageHeight">
                        {{ file.imageWidth }}x{{ file.imageHeight }}
                    </template>
                </td>
                <td>
                    <template v-if="file.size">
                        {{ file.sizeFormatted }}
                    </template>
                </td>
            </tr>
            </tbody>
        </table>
        -->
    </div>
</template>

<script>
    let SERVER = 'http://127.0.0.1:8000';

    import Vue from 'vue'
    import axios from 'axios';
    import VueAxios from 'vue-axios';
    import Toastr from 'vue-toastr';
    import VueImg from 'v-img';

    Vue.use(VueAxios, axios);
    Vue.use(Toastr, {
        defaultTimeout: 2500,
        defaultProgressBar: false,
        defaultProgressBarValue: 0,
        defaultPosition: "toast-top-full-width",
        defaultCloseOnHover: false
    });
    Vue.use(VueImg);

    export default {
        name: 'CatalogFiles',
        components: {
        },
        props: {

        },
        data: function() {
            return {
            }
        },
        created: function() {
            this.SERVER = SERVER;
        },
        filters: {
            upper: function (value) {
                return value.toUpperCase();
            }
        },
        computed: {
            catalogFiles: function () {
                return this.$store.state.files
            },
            filesIsLoading: function () {
                return this.$store.state.filesIsLoading
            },
        },
        methods: {

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .file-type:first-letter {
        text-transform: capitalize;
    }
    .thumb {
        max-height: 50px;
    }
</style>
