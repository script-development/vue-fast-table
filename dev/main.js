import Vue from 'vue';
import minimalTable from '../dist/index.esm';

new Vue({
    render(h) {
        const items = ['a', 'b'];
        return h(minimalTable, [items, 'Hallo!']);
        // return h('h1', ["Hij werkt nu!"]);
    },
}).$mount('#app');
