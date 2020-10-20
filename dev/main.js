import Vue from 'vue';
import minimalTable from '../dist/index.esm';
import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

const dec2hex = dec => (dec < 10 ? '0' + String(dec) : dec.toString(16));
const generateRandomString = len => Array.from(crypto.getRandomValues(new Uint8Array(len)), dec2hex).join('');
const randomInteger = Math.floor(Math.random() * 10000);

new Vue({
    data: {
        valueField: '',
        numberOfRows: 10,
        numberOfFields: 3,
        formatter: '',
        useFormatterFunction: true,
        useActions: true,
        fields: [],
        items: [],
        column: {},
        item: {},
    },
    methods: {
        createData() {
            if (this.fields.length < this.numberOfFields) {
                for (let j = 0; j < this.numberOfFields; j++) {
                    let field = {
                        id: j,
                        key: generateRandomString(5),
                        label: generateRandomString(5),
                    };
                    this.fields.push(field);
                }

                if (this.useFormatterFunction && !this.fields.includes('formatter')) {
                    this.fields.push({
                        id: randomInteger,
                        key: 'formatter',
                        formatter: () => {
                            return this.numberOfRows % 2 == 0 ? 'even' : 'oneven';
                        },
                    });
                }
            }

            for (let i = 0; i < this.numberOfRows; i++) {
                let item = {};
                for (const field of this.fields) {
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
    mounted() {
        this.createData();
    },
    render(h) {
        // TODO :: test with all possibilities
        const table = h(minimalTable, {props: {fields: this.fields, items: this.items}});
        const btable = h('b-table', {props: {fields: this.fields, items: this.items}});
        const addButton = h('button', {on: {click: this.addRow}}, 'Voeg 1000 rijen toe');
        // return h('div', [addButton, table]);
        return h('div', [addButton, table, btable]);
    },
}).$mount('#app');
