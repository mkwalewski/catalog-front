<template>
    <div>
        <div class="text-left">
            <div class="putbox inline-block">
                <div class="putbox-icon">
                    <span class="glyph glyph-all-apps"></span>
                </div>
                <div class="putbox-content">
                    <div class="content-title">Wybierz typy:</div>
                    <form class="content-form">
                        <div class="combobox">
                            <select class="form-control" v-model="filesType">
                                <option value="all">Wszystkie</option>
                                <option value="media">Video, Audio, Image</option>
                                <option value="video">Video</option>
                                <option value="audio">Audio</option>
                                <option value="image">Image</option>
                            </select>
                        </div>
                    </form>
                </div>

                <div class="putbox-icon">
                    <span class="glyph glyph-sort"></span>
                </div>
                <div class="putbox-content">
                    <div class="content-title">Wybierz sortowanie:</div>
                    <form class="content-form">
                        <div class="combobox">
                            <select class="form-control" v-model="filesSort">
                                <option value="filename">Nazwa pliku</option>
                                <option value="folder">Folder</option>
                                <option value="size">Rozmiar</option>
                                <option value="length">Długość</option>
                            </select>
                        </div>
                    </form>
                </div>

                <div class="putbox-content">
                    <div class="content-title">Typ:</div>
                    <form class="content-form">
                        <div class="combobox">
                            <select class="form-control" v-model="filesSortType">
                                <option value="asc">Rosnąco</option>
                                <option value="desc">Malejąco</option>
                            </select>
                        </div>
                    </form>
                </div>
            </div>
        </div>
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
                        <th class="text-center">Akcja</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(file,key) in catalogFiles" :key="file.id">
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
                        <td class="action-buttons text-right">
                            <button type="button" class="btn btn-link" @click="toggleFavorite(file.id)">
                                <template v-if="file.favorite">
                                    <span class="type-t4 glyph glyph-star" aria-hidden="true"></span>
                                </template>
                                <template v-else>
                                    <span class="type-t4 glyph glyph-star-outline" aria-hidden="true"></span>
                                </template>
                            </button>

                            <button type="button" class="btn btn-primary" @click="openFolder(file.id)">
                                <span class="glyph glyph-folder-horizontal-open" aria-hidden="true"></span>
                            </button>

                            <button v-show="file.type == 'video'" type="button" class="btn btn-primary" @click.once="getFrames(file.id)" data-toggle="modal" :data-target="'#modal-preview-' +file.id">
                                <span class="glyph glyph-info" aria-hidden="true"></span>
                            </button>

                            <button type="button" class="btn btn-danger delete-file">
                                <span class="glyph glyph-delete" aria-hidden="true"></span>
                            </button>

                            <div class="modal" :id="'modal-preview-' +file.id" tabindex="-1" role="dialog" aria-hidden="true">
                                <div class="modal-dialog" style="width: 90%;">
                                    <div class="modal-content">
                                        <div class="modal-header"></div>
                                        <div class="modal-body text-center">
                                            <h3 class="pulgitl-left">{{ file.filename }}</h3>
                                            <button type="button" class="btn btn-danger pull-right" @click="generateFrames(file.id)">
                                                Generuj miniaturki
                                            </button>
                                            <div class="clearfix"></div>
                                            <div class="col-md-8 type-t4 text-left">
                                                Czas trwania: <b>{{ file.lengthFormatted }}</b><br/>
                                                Rozmiar: <b>{{ file.sizeFormatted }}</b><br/>
                                                Rozdzielczość: <b>{{ file.videoWidth }}x{{ file.videoHeight }}</b><br/>
                                            </div>
                                            <div class="clearfix"></div>
                                            <template v-if="framesIsLoading">
                                                <div class="m-xxs progress-ring progress-large">
                                                    <div class="progress-circle"></div>
                                                    <div class="progress-circle"></div>
                                                    <div class="progress-circle"></div>
                                                    <div class="progress-circle"></div>
                                                    <div class="progress-circle"></div>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <div class="p-t-xs">
                                                    <div class="col-sm-4 frame" v-for="frame in file.frames" :key="frame.id">
                                                        <img v-img="{
                                                group: file.id,
                                                src: SERVER + frame.image,
                                                title: frame.time
                                                }" :src="SERVER + frame.thumb" />
                                                        <b>{{ frame.time }}</b>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                        <div class="modal-footer"></div>
                                    </div>
                                </div>
                            </div>
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
    import _ from 'lodash';

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
                filesType: 'all',
                filesSort: 'filename',
                filesSortType: 'asc',
                framesIsLoading: false
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
                let self = this;
                let files = this.$store.state.files;
                files = files.filter(function(file){
                    return self.filesType === 'all' || (self.filesType === 'media' && file.type.indexOf('other') === -1) || self.filesType === file.type;
                });
                if (this.filesSort === 'size')
                {
                    files = _.orderBy(files, function(o){
                        return parseInt(o.size, 10);
                    }, this.filesSortType);
                }
                else
                {
                    files = _.orderBy(files, this.filesSort, this.filesSortType);
                }
                return files;
            },
            filesIsLoading: function () {
                return this.$store.state.filesIsLoading;
            },
        },
        methods: {
            showAlerts: function (alerts) {
                let success = false;
                for (let type in alerts)
                {
                    let messages = alerts[type];
                    for (let i in messages)
                    {
                        let text = messages[i];
                        switch (type)
                        {
                            case 'success':
                                success = true;
                                this.$toastr.s(text);
                                break;
                            case 'error':
                                this.$toastr.e(text);
                                break;
                        }
                    }
                }
                return success;
            },
            toggleFavorite: function (id) {
                let self = this;
                let data = {
                    'id': id
                };
                this.$http.post(SERVER + '/toggle_favorite', data).then((response) => {
                    if (response.data.alerts)
                    {
                        if (this.showAlerts(response.data.alerts))
                        {
                            self.$store.commit('updateFiles', {id: id, name: 'favorite', value: response.data.status});
                        }
                    }
                });
            },
            getFrames: function (id) {
                let self = this;
                let data = {
                    'id': id
                };
                self.framesIsLoading = true;
                this.$http.post(SERVER + '/get_frames', data).then((response) => {
                    self.framesIsLoading = false;
                    self.$store.commit('updateFiles', {id: id, name: 'frames', value: response.data.frames});
                });
            },
            generateFrames: function (id) {
                let self = this;
                let data = {
                    'id': id
                };
                self.framesIsLoading = true;
                this.$http.post(SERVER + '/generate_frames', data).then((response) => {
                    self.framesIsLoading = false;
                    if (response.data.alerts)
                    {
                        if (this.showAlerts(response.data.alerts))
                        {
                            self.$store.commit('updateFiles', {id: id, name: 'frames', value: response.data.frames});
                        }
                    }
                });
            },
            openFolder: function (id) {
                let data = {
                    'id': id
                };
                this.$http.post(SERVER + '/open_folder', data).then(() => {

                });
            }
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
    .action-buttons {
        white-space: nowrap;
    }
    .action-buttons button {
        min-width: 50px !important;
        margin: 0 3px !important;
    }
    .modal h3 {
        padding: 0 0 10px 0;
    }
    .frame {
        padding: 0 10px 10px 0;
    }
    .frame img {
        width: 100%;
    }
    .frame b {
        position: absolute;
        right: 15px;
        bottom: 10px;
        color: white;
        text-shadow: 1px 1px black;
    }
</style>
