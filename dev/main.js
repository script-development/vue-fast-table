import Vue from 'vue';
import minimalTable from '../dist/index';

const dec2hex = dec => (dec < 10 ? '0' + String(dec) : dec.toString(16));
const generateRandomString = len => Array.from(crypto.getRandomValues(new Uint8Array(len)), dec2hex).join('');

new Vue({
    data: {
        numberOfRows: 20,
        numberOfFields: 3,
        useFormatterFunction: true,
        fields: [],
        items: [],
    },
    methods: {
        createData() {
            for (let j = 0; j < this.numberOfFields; j++) {
                this.fields.push(generateRandomString(5));
            }
            for (let i = 0; i < this.numberOfRows; i++) {
                let item = {};
                for (let field of this.fields) {
                    item[field] = generateRandomString(10);
                }
                this.items.push(item);
            }
        },
    },
    mounted() {
        this.createData();
    },
    render(h) {
        return h(minimalTable, {props: {fields: this.fields, items: this.items}});
    },
}).$mount('#app');
