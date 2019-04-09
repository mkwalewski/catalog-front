<template>
    <div v-show="catalogTree.length > 0" class="catalog-tree m-xxxs color-bg-light-vivid-high">
        <v-jstree :data="catalogTree" @item-toggle="catalogTreeToggle" >
            <template slot-scope="_">
                <div>
                    <span @click="catalogTreeClick(_.vm, _.model, $event)">
                        <i :class="_.vm.themeIconClasses" role="presentation" v-if="!_.model.loading"></i>
                    {{_.model.text}}
                    </span>
                    <template v-if="_.model.type == 'group' || _.model.type == 'disk'">
                        &nbsp;<i class="fa fa-edit color-type-accent" @click="catalogTreeEdit(_.vm, _.model, $event)"></i>
                        &nbsp;<i class="fa fa-times color-type-alert" @click="catalogTreeDelete(_.vm, _.model, $event)"></i>
                    </template>
                </div>
            </template>
        </v-jstree>
    </div>
</template>

<script>
    //@item-click="catalogTreeClick"
    //@item-toggle="jstreeToggle" @item-click="jstreeClick"
    let SERVER = 'http://127.0.0.1:8000';

    import Vue from 'vue'
    import axios from 'axios';
    import VueAxios from 'vue-axios';
    import VJstree from 'vue-jstree';
    import VueSweetalert2 from 'vue-sweetalert2';
    import Toastr from 'vue-toastr';

    Vue.use(VueAxios, axios);
    Vue.use(VueSweetalert2);
    Vue.use(Toastr, {
        defaultTimeout: 2500,
        defaultProgressBar: false,
        defaultProgressBarValue: 0,
        defaultPosition: "toast-top-full-width",
        defaultCloseOnHover: false
    });

    export default {
        name: 'CatalogTree',
        components: {
            VJstree
        },
        props: {

        },
        data: function() {
            return {
            }
        },
        created: function() {

        },
        computed: {
            catalogTree: function () {
                return this.$store.state.catalogTree
            }
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
            getDisk: function (item) {
                let data = {
                    group_id: item['value']
                };
                this.$http.post(SERVER + '/get_catalog_disks', data).then((response) => {
                    item['children'] = [];
                    for (let i = 0; i < response.data.length; i++)
                    {
                        item['children'].push({
                            'type': 'disk',
                            'text': response.data[i].name,
                            'value': response.data[i].id,
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
            getFolders: function (item) {
                let data = {
                    disk_id: item['value']
                };
                this.$http.post(SERVER + '/get_catalog_folders', data).then((response) => {
                    item['children'] = response.data;
                });
            },
            getFilesByDiskId: function (item) {
                let self = this;
                let data = {
                    disk_id: item['value']
                };
                this.$store.commit('setFiles', []);
                this.$store.commit('setFilesIsLoading', true);
                this.$http.post(SERVER + '/get_catalog_files', data).then((response) => {
                    self.$store.commit('setFiles', response.data);
                    self.$store.commit('setFilesIsLoading', false);
                });
            },
            catalogTreeToggle: function (node, item) {
                if ("children" in item && 0 in item['children'])
                {
                    if (item['children'][0]['isLoading'] === true)
                    {
                        item['children'][0]['isLoading'] = false;
                        switch (item['type'])
                        {
                            case 'group':
                                this.getDisk(item);
                                break;
                            case 'disk':
                                this.getFolders(item);
                                break;
                        }
                    }
                }
            },
            catalogTreeClick: function (node, item) {
                switch (item['type'])
                {
                    case 'disk':
                        this.getFilesByDiskId(item);
                        break;
                }
            },
            catalogTreeEdit: function (node, item){
                let swalTitle = null;
                switch (item['type'])
                {
                    case 'group':
                        swalTitle = 'Edytuj nazwę grupy';
                        break;
                    case 'disk':
                        swalTitle = 'Edytuj nazwę katalogu';
                        break;
                }
                if (swalTitle)
                {
                    this.$swal({
                        title: swalTitle,
                        input: 'text',
                        inputValue: item.text,
                        showCancelButton: true,
                        confirmButtonText: 'Zapisz',
                        cancelButtonText: 'Anuluj'
                    }).then((result) => {
                        if (result.value)
                        {
                            let data = {
                                id: item.value,
                                name: result.value
                            };
                            this.$http.post(SERVER + '/edit_' + item['type'] + '_name', data).then((response) => {
                                if (response.data.alerts)
                                {
                                    if (this.showAlerts(response.data.alerts))
                                    {
                                        item['text'] = result.value;
                                    }
                                }
                            });
                        }
                    });
                }
            },
            catalogTreeDelete: function (node, item) {
                let swalTitle = null;
                switch (item['type'])
                {
                    case 'group':
                        swalTitle = 'Usuń nazwę grupy';
                        break;
                }
                if (swalTitle)
                {
                    this.$swal({
                        title: swalTitle,
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        confirmButtonText: 'Tak - usuń',
                        cancelButtonText: 'Anuluj'
                    }).then((result) => {
                        if (result.value)
                        {
                           alert('test');
                        }
                    });
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .catalog-tree {
        padding: 0 10px 10px 10px;
        border: 2px solid rgba(0,0,0,.3);
    }
</style>
