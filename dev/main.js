import Vue from 'vue';
import minimalTable from '../dist/index.esm';
import {BTable} from 'bootstrap-vue';
import './style.css';

const dec2hex = dec => (dec < 10 ? '0' + String(dec) : dec.toString(16));
const generateRandomString = len => Array.from(crypto.getRandomValues(new Uint8Array(len)), dec2hex).join('');

new Vue({
    data: {
        numberOfRows: 10,
        numberOfFields: 3,
        fields: [],
        items: [],
        column: {},
        keys: ['name', 'formatter'],
        item: {},
        sortBy: 'name',
    },
    mounted() {
        this.createFields();
        this.createData();
    },
    methods: {
        createFields() {
            for (let j = 0; j < this.numberOfFields; j++) {
                const key = generateRandomString(5);
                this.keys.push(key);
                this.fields.push({
                    key,
                    label: generateRandomString(5),
                });
            }

            this.fields.push({
                key: 'formatter',
                formatter: (value, key, item) => {
                    if (typeof value == 'object') {
                        return value.formatter + value.formatter;
                    }
                    return value + item[key];
                },
            });

            this.fields.push({
                key: 'tdClass',
                label: '',
                tdClass: () => (Math.random() < 0.5 ? 'inclusive_test' : 'exclusive_test'),
            });

            this.fields.push({key: 'name', label: 'Harry'});
        },
        createData() {
            for (let i = 0; i < this.numberOfRows; i++) {
                let item = {};
                for (const field of this.fields) {
                    if (field.key == 'tdClass') {
                        item[field.key] = '';
                    }
                    if (field.key == 'formatter') {
                        item[field.key] = '';
                    }
                    item[field.key] = generateRandomString(5);
                }
                this.items.push(item);
            }
        },
        addRow() {
            console.time('adding data');
            this.numberOfRows += 1000;
            this.createData();
            console.timeEnd('adding data');
        },
    },
    render(h) {
        const args = {props: {fields: this.fields, items: this.items, sortBy: this.sortBy}};

        // TODO :: test with all possibilities
        const tableTitle = h('h3', {}, ['vue fast table']);
        const table = h(minimalTable, args); // 161ms

        const btableTitle = h('h3', {}, ['bootstrap table']);
        const btable = h(BTable, args); // 2820ms

        const selecta = h(
            'select',
            {
                domProps: {value: this.sortBy},
                on: {input: e => (this.sortBy = e.target.value)},
            },
            [this.keys.map(k => h('option', {attrs: {value: k}}, [k]))]
        );

        const addButton = h('button', {on: {click: this.addRow}}, 'Voeg 1000 rijen toe');
        return h('div', [addButton, selecta, tableTitle, table, btableTitle, btable]);
    },
}).$mount('#app');
