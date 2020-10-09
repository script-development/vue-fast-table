import Vue from 'vue';
import minimalTable from '../dist/index';
import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

const dec2hex = dec => (dec < 10 ? '0' + String(dec) : dec.toString(16));
const generateRandomString = len => Array.from(crypto.getRandomValues(new Uint8Array(len)), dec2hex).join('');

new Vue({
    data: {
        valueField: '',
        numberOfRows: 100,
        numberOfFields: 5,
        formatter: '',
        useFormatterFunction: true,
        fields: [],
        items: [],
        field: {},
        item: {},
    },
    methods: {
        createData() {
            if (this.fields.length < this.numberOfFields) {
                for (let j = 0; j < this.numberOfFields; j++) {
                    let field = {id: j, label: generateRandomString(5)};
                    this.fields.push(field);
                }
                if (this.useFormatterFunction) {
                    this.fields.push('formatter');
                }
            }
            for (let i = this.items.length; i < this.numberOfRows; i++) {
                let item = {};
                for (let field of this.fields) {
                    if (field == 'formatter') {
                        item[field] = () => {
                            if (this.numberOfRows % 2 == 0) {
                                return 'Even!';
                            }
                            return 'Oneven!';
                        };
                        break;
                    }
                    item[field] = generateRandomString(10);
                }
                this.items.push(item);
            }
        },
        addRow() {
            console.time('addRow');
            this.numberOfRows++;
            this.createData();
            console.timeEnd('addRow');
        },
    },
    mounted() {
        this.createData();
    },
    render(h) {
        const table = h(minimalTable, {props: {fields: this.fields, items: this.items}});
        const btable = h('b-table', {props: {fields: this.fields, items: this.items}});
        const addButton = h('button', {on: {click: this.addRow}}, 'Voeg een rij toe');
        return h('div', [addButton, table, btable]);
    },
}).$mount('#app');
