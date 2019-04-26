import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import _ from 'lodash';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        SERVER: 'http://127.0.0.1:8000',
        files: [],
        filesIsLoading: false,
        groups: [],
        catalogTree: [],
    },
    mutations: {
        setGroups(state, payload) {
            state.groups = payload;
            state.catalogTree = [];
            for (let key in payload)
            {
                let group = payload[key];
                state.catalogTree.push({
                    'type': 'group',
                    'text': group.name,
                    'value': group.id,
                    'icon': 'fa fa-database',
                    'opened': false,
                    'children': [
                        {
                            "text": "Loading...",
                            "value": "Loading...",
                            "icon": "",
                            "opened": false,
                            "selected": false,
                            "disabled": false,
                            "loading": true,
                            "isLoading": true,
                            "children": []
                        }
                    ]
                });
            }
        },
        updateGroup(state, payload) {
            let groupsIndex = _.findIndex(state.groups, ['id', payload.id]);
            state.groups[groupsIndex].name = payload.name;
            let catalogTreeIndex = _.findIndex(state.catalogTree, ['value', payload.id]);
            state.catalogTree[catalogTreeIndex].text = payload.name;
        },
        updateDisk(state, payload) {
            let nodeIndex = _.findIndex(state.catalogTree, {children: [{value: payload.id}]});
            let itemIndex = _.findIndex(state.catalogTree[nodeIndex].children, ['value', payload.id]);
            state.catalogTree[nodeIndex].children[itemIndex].text = payload.name;
        },
        setDisk(state, payload) {
            let disks = [];
            for (let i = 0; i < payload.disks.length; i++)
            {
                disks.push({
                    'type': 'disk',
                    'text': payload.disks[i].name,
                    'value': payload.disks[i].id,
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
            let catalogTreeIndex = _.findIndex(state.catalogTree, ['value', payload.id]);
            state.catalogTree[catalogTreeIndex].children = disks;
        },
        deleteGroup(state, payload) {
            let groupsIndex = _.findIndex(state.groups, ['id', payload.value]);
            state.groups.splice(groupsIndex, 1);
            let catalogTreeIndex = _.findIndex(state.catalogTree, ['value', payload.value]);
            state.catalogTree.splice(catalogTreeIndex, 1);
        },
        deleteDisk(state, payload) {
            let nodeIndex = _.findIndex(state.catalogTree, {children: [{value: payload.value}]});
            let itemIndex = _.findIndex(state.catalogTree[nodeIndex].children, ['value', payload.value]);
            state.catalogTree[nodeIndex].children.splice(itemIndex, 1);
        },
        setFiles(state, payload) {
            state.files = payload;
        },
        updateFiles(state, payload) {
            let index = _.findIndex(state.files, ['id', payload.id]);
            state.files[index][payload.name] = payload.value;
        },
        deleteFile(state, payload) {
            let index = _.findIndex(state.files, ['id', payload.id]);
            state.files.splice(index, 1);
        },
        setFilesIsLoading(state, payload) {
            state.filesIsLoading = payload;
        },
    },
    actions: {
        refreshDiskForGroup(context, payload) {
            let data = {
                'group_id': payload.id
            };
            axios.post(context.state.SERVER + '/get_catalog_disks', data).then((response) => {
                context.commit('setDisk', {
                    'id': payload.id,
                    'disks': response.data
                });
            });
        }
    }
})
