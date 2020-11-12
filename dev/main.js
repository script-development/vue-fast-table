import {createApp, h, reactive} from 'vue';
import fastTable from '../dist/index.esm.js';

const dec2hex = dec => (dec < 10 ? '0' + String(dec) : dec.toString(16));
const generateRandomString = len => Array.from(crypto.getRandomValues(new Uint8Array(len)), dec2hex).join('');
const randomInteger = Math.floor(Math.random() * 10000);

createApp({
    setup() {
        const state = reactive({
            numberOfItems: 20,
            numberOfFields: 3,
            fields: [],
            items: [],
        });

        const createData = () => {
            // create fields
            if (state.fields.length < state.numberOfFields) {
                for (let j = 0; j < state.numberOfFields; j++) {
                    let field = {
                        id: j,
                        key: generateRandomString(5),
                        label: generateRandomString(5),
                    };
                    state.fields.push(field);
                }

                // add a formatter
                state.fields.push({
                    id: randomInteger,
                    key: 'formatter',
                    formatter: () => {
                        return 'hoi!';
                    },
                });

                // add a tdClass
                state.fields.push({
                    id: randomInteger,
                    key: 'tdClass',
                    label: '',
                    /* eslint-disable no-unused-vars */
                    tdClass: (tdClass, key, item) => {
                        if (Math.random() < 0.5) {
                            return 'inclusive_test';
                        }
                        return 'exclusive_test';
                    },
                    /* eslint-enable no-unused-vars */
                });
            }

            // create the items
            for (let i = 0; i < state.numberOfItems; i++) {
                let item = {};
                for (const field of state.fields) {
                    if (field.key == 'tdClass') {
                        item[field.key] = '';
                        continue;
                    }
                    if (field.key == 'formatter') {
                        item[field.key] = '';
                        continue;
                    }
                    item[field.key] = generateRandomString(5);
                }
                state.items.push(item);
            }
        };

        createData();
        return {state, createData};
    },
    render() {
        return h(
            fastTable,
            {
                fields: this.state.fields,
                items: this.state.items,
                onRowClicked: () => {
                    console.log('hoi!');
                },
            },
            // slots: {
            {[`cell(${this.state.fields[0].key})`]: 'hallo'}
            // },
        );
    },
}).mount('#app');
