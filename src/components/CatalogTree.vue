<template>
    <div>
        <v-jstree :data="catalogTree" @item-toggle="catalogTreeToggle"  />
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
        name: 'AddGroup',
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
            catalogTreeToggle: function (node, item) {
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
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
