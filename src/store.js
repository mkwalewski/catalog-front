import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
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
        }
    },
    actions: {

    }
})
