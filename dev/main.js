import Vue from 'vue';
import minimalTable from '../dist/index.esm';
import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

const dec2hex = dec => (dec < 10 ? '0' + String(dec) : dec.toString(16));
const generateRandomString = len => Array.from(crypto.getRandomValues(new Uint8Array(len)), dec2hex).join('');

new Vue({
    data: {
        valueField: '',
        numberOfRows: 10,
        numberOfColumns: 5,
        formatter: '',
        useFormatterFunction: true,
        useActions: true,
        columns: [],
        items: [],
        column: {},
        item: {},
    },
    methods: {
        createData() {
            if (this.columns.length < this.numberOfColumns) {
                for (let j = 0; j < this.numberOfColumns; j++) {
                    let column = {id: j, label: generateRandomString(5)};
                    this.columns.push(column);
                }
                if (this.useFormatterFunction && !this.columns.includes('formatter')) {
                    this.columns.push('formatter');
                }
                if (this.useActions && !this.columns.includes('actions')) {
                    this.columns.push('actions');
                }
            }
            console.log(this.columns);
            for (let i = this.items.length; i < this.numberOfRows; i++) {
                let item = {};
                for (let column of this.columns) {
                    if (column == 'formatter') {
                        item[column] = () => {
                            if (this.numberOfRows % 2 == 0) {
                                return 'Even!';
                            }
                            return 'Oneven!';
                        };
                    }
                    if (column == 'actions') {
                        item[column] = '<template><div><span>Hallo!</span></div></template>';
                    }
                    item[column.label] = generateRandomString(10);
                }
                this.items.push(item);
            }
        },
        addRow() {
            this.numberOfRows++;
            this.createData();
        },
    },
    mounted() {
        this.createData();
    },
    render(h) {
        const table = h(minimalTable, {props: {fields: this.columns, items: this.items}}, [h('template', 'hallo!')]);
        // const btable = h('b-table', {props: {columns: this.columns, items: this.items}});
        const addButton = h('button', {on: {click: this.addRow}}, 'Voeg een rij toe');
        return h('div', [addButton, table]);
        // return h('div', [addButton, table, btable]);
    },
}).$mount('#app');
