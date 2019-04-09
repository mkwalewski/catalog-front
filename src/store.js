import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
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
        setFiles(state, payload) {
            state.files = payload;
        },
        updateFiles(state, payload) {
            let index = _.findIndex(state.files, ['id', payload.id]);
            state.files[index][payload.name] = payload.value;
        },
        setFilesIsLoading(state, payload) {
            state.filesIsLoading = payload;
        },
    },
    actions: {

    }
})
