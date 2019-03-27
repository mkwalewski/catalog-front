<template>
    <div class="catalog-tree m-xxxs color-bg-light-vivid-high">
        <v-jstree :data="catalogTree" @item-toggle="catalogTreeToggle" @item-click="catalogTreeClick" />
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
