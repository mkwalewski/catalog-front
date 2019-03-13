<template>
    <div>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal-sample">Dodaj</button>
        <div class="modal" id="modal-sample"
             tabindex="-1" role="dialog"
             aria-labelledby="modal-sample-label" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="modal-sample-label">
                            Dodaj katalog
                        </h4>
                    </div>
                    <div class="modal-body">
                        <template v-if="isProcesing">
                            <div class="text-center p-xs">
                                <div class="progress-ring progress-medium">
                                    <div class="progress-circle"></div>
                                    <div class="progress-circle"></div>
                                    <div class="progress-circle"></div>
                                    <div class="progress-circle"></div>
                                    <div class="progress-circle"></div>
                                </div>
                                <div class="clearfix"></div>
                                <div v-if="items.length > 0">
                                    <div>
                                        Plik <b>{{ currentItem }}</b> z <b>{{ maxItems }}</b> ({{ currentProgress }}%)
                                    </div>
                                    <div>
                                        {{ currentFileName }}
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="col-sm-4 p-xxxs">
                                <label for="inputName">Nazwa</label>
                            </div>
                            <div class="col-sm-20">
                                <input type="text" class="form-control" id="inputName" v-model="catalogName" placeholder="Wpisz nazwę">
                            </div>
                            <div class="clearfix"></div>
                            <div class="col-sm-4 p-xxxs">
                                <label for="inputCatalog">Katalog</label>
                            </div>
                            <div class="col-sm-20">
                                <input type="text" class="form-control" id="inputCatalog" v-model="catalogDisk" readonly>
                                <div class="tree-catalog line color-line-neutral-mid color-bg-light-vivid-hig">
                                    <v-jstree :data="jstree" @item-click="jstreeClick" @item-toggle="jstreeToggle" />
                                </div>
                            </div>
                            <div class="clearfix"></div>
                        </template>
                    </div>
                    <div class="modal-footer">
                        <template v-if="isProcesing">
                            <div class="text-center">
                                <button type="button" class="btn btn-danger" @click="stopProcessing">
                                    Anuluj
                                </button>
                            </div>
                        </template>
                        <template v-else>
                            <button type="button" class="btn btn-primary" @click="addCatalog" :disabled="!catalogName">
                                Zapisz
                            </button>
                            <button type="button" class="btn btn-info" data-dismiss="modal">
                                Zamknij
                            </button>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    //@item-toggle="jstreeToggle" @item-click="jstreeClick"
    let SERVER = 'http://127.0.0.1:8000';

    import Vue from 'vue'
    import axios from 'axios';
    import VueAxios from 'vue-axios';
    import VJstree from 'vue-jstree';
    import Toastr from 'vue-toastr';

    Vue.use(VueAxios, axios);
    Vue.use(Toastr, {
        defaultTimeout: 2500,
        defaultProgressBar: false,
        defaultProgressBarValue: 0,
        defaultPosition: "toast-top-full-width",
        defaultCloseOnHover: false
    });

    export default {
        name: 'AddCatalog',
        components: {
            VJstree
        },
        props: {
            msg: String
        },
        data: function() {
            return {
                isProcesing: false,
                jstree: [],
                catalogName: '',
                catalogDisk: '',
                catalogDiskId: 0,
                currentItem: 0,
                currentFileName: '',
                items: [],
                maxItems: 0,

                /*
                scanFolderData: {
                    isProcessing: false,
                    filesToScan: [],
                    currentFile: '',
                    currentItem: 0,
                    maxItems: 0,
                    percent: 0,
                    successItems: 0,
                    errorsItems: 0
                },
                form: {
                    scanFolder: {
                        paths: '',
                        recursively: false,
                        generateThumbs: false
                    }
                },
                isLoading: false,
                isThumbsLoading: false,

                currentFile: '',
                currentStep: 0,
                files: [],
                filesToCache: [],
                maxFilesToCache: 0,
                type: 'media',
                orderBy: 'filename',
                orderByType: 'asc',
                */
            }
        },
        created: function() {
            this.SERVER = SERVER;
            this.getTree();
        },
        computed: {
            currentProgress: function() {
                return parseInt(this.currentItem  * 100 / this.maxItems);
            }
        },
        methods: {
            getTree: function() {
                let self = this;
                this.$http.get(SERVER + '/get_list_of_partitions').then((response) => {
                    for (let i = 0; i < response.data.length; i++)
                    {
                        self.jstree.push({
                            'text': response.data[i],
                            'value': response.data[i],
                            "children": [
                                {
                                    "text": "Loading...",
                                    "value": "Loading...",
                                    "icon": "",
                                    "opened": false,
                                    "selected": false,
                                    "disabled": true,
                                    "loading": true,
                                    "isLoading": true,
                                    "children": []
                                }
                            ],
                            "opened": false,
                        });
                    }
                });
            },
            jstreeClick: function (node, item) {
                this.catalogDisk = item['value'];
            },
            jstreeToggle: function (node, item) {
                if (item['children'][0]['isLoading'] === true)
                {
                    item['children'][0]['isLoading'] = false;
                    this.$http.post(SERVER + '/get_list_of_folders',{path:item['value']}).then((response) => {
                        item['children'] = [];
                        for (let i = 0; i < response.data.length; i++)
                        {
                            item['children'].push({
                                'text': response.data[i],
                                'value': item['value'] + '\\' + response.data[i],
                                "children": [
                                    {
                                        "text": "Loading...",
                                        "value": "Loading...",
                                        "icon": "",
                                        "opened": false,
                                        "selected": false,
                                        "disabled": true,
                                        "loading": true,
                                        "isLoading": true,
                                        "children": []
                                    }
                                ],
                                "opened": false,
                            });
                        }
                    });
                }
            },
            stopProcessing: function (){
                let self = this;
                let data = {
                    'catalog_disk_id': this.catalogDiskId
                };
                this.$http.post(SERVER + '/cancel_add_catalog_file', data).then(() => {
                    //@TODO
                    self.catalogDiskId = 0;
                    self.currentItem = 0;
                    self.currentFileName = '';
                    self.items = [];
                    self.maxItems = 0;
                    self.isProcesing = false;
                });
            },
            processItem: function () {
                let self = this;
                if (this.items.length > 0)
                {
                    let path = this.items.shift();
                    this.currentItem++;
                    this.currentFileName = path;
                    let data = {
                        'catalog_disk_id': this.catalogDiskId,
                        'path': path
                    };
                    this.$http.post(SERVER + '/add_catalog_file', data).then((response) => {
                        if (response.data.alerts)
                        {
                            for (let type in response.data.alerts)
                            {
                                let messages = response.data.alerts[type];
                                for (let i in messages)
                                {
                                    let text = messages[i];
                                    switch (type)
                                    {
                                        case 'success':
                                            self.$toastr.s(text);
                                            break;
                                        case 'error':
                                            self.$toastr.e(text);
                                            break;
                                    }
                                }
                            }
                        }
                        self.processItem();
                        /*if (response.data)
                        {
                            self.files.push(response.data);
                        }*/
                        //self.processItem();
                    });
                }
                else
                {
                    this.isProcesing = false;
                }
            },
            addCatalog: function () {
                let self = this;
                let data = {
                    'name': this.catalogName,
                    'path': this.catalogDisk
                };
                this.$http.post(SERVER + '/add_catalog', data).then((response) => {
                    self.catalogDiskId = response.data.id;
                    self.currentItem = 0;
                    self.currentFileName = '';
                    self.items = response.data.files;
                    self.maxItems = response.data.files.length;
                    self.isProcesing = true;
                    self.processItem();
                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    #inputCatalog:focus {
        border-color: rgba(0,0,0,.6);
        background-color: rgba(0,0,0,.1);
    }
    .tree-catalog {
        height: 300px;
        overflow-x: hidden;
        overflow-y: scroll;
    }
</style>
