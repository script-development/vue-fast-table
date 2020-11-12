import {computed, createApp, h, ref} from 'vue';
import fastTable from '../dist/index.esm.js';

const dec2hex = dec => (dec < 10 ? '0' + String(dec) : dec.toString(16));
const generateRandomString = len => Array.from(crypto.getRandomValues(new Uint8Array(len)), dec2hex).join('');
const numberOfFields = 3;

createApp({
    setup() {
        const numberOfItems = ref(20);
        const fields = [];

        // create fields
        for (let j = 0; j < numberOfFields; j++) {
            fields.push({
                key: generateRandomString(5),
                label: generateRandomString(5),
            });
        }

        // add a formatter
        fields.push({
            key: 'formatter',
            formatter: () => {
                return 'hoi!';
            },
        });

        // add a tdClass
        fields.push({
            key: 'tdClass',
            label: 'td class',
            tdClass: () => {
                if (Math.random() < 0.5) {
                    return 'inclusive_test';
                }
                return 'exclusive_test';
            },
        });

        const items = computed(() => {
            const items = [];
            // create the items
            for (let i = 0; i < numberOfItems.value; i++) {
                let item = {};
                for (const field of fields) {
                    if (field.key == 'tdClass' || field.key == 'formatter') {
                        item[field.key] = '';
                        continue;
                    }
                    item[field.key] = generateRandomString(5);
                }
                items.push(item);
            }
            return items;
        });

        const increment = () => (numberOfItems.value += 1000);
        return {fields, items, increment};
    },
    render() {
        return [
            h(
                'button',
                {
                    onClick: this.increment,
                },
                'Voeg 1000 rijen toe'
            ),
            h(
                fastTable,
                {
                    fields: this.fields,
                    items: this.items,
                    onRowClicked: () => {
                        console.log('hoi!');
                    },
                },
                {[`cell(${this.fields[0].key})`]: 'hallo'}
            ),
        ];
    },
}).mount('#app');
