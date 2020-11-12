import {h} from 'vue';

/**
 * @typedef {import('vue').CreateElement} CreateElement
 * @typedef {import('../types').Field} Field
 * @typedef {import('../types').Item} Item
 */

//  TODO :: dependant on Bootstrap CSS, either add that or add custom css
const VueFastTable = {
    name: 'vueFastTable',
    functional: true,
    props: {
        /**
         * @type {Item[]} items - required
         */
        items: {
            type: Array,
            required: true,
        },

        /**
         * @type {Field[]} fields - required
         */
        fields: {
            type: Array,
            required: true,
        },
        borderless: {
            type: Boolean,
            default: () => false,
        },
        outlined: {
            type: Boolean,
            default: () => false,
        },
        bordered: {
            type: Boolean,
            default: () => false,
        },
        striped: {
            type: Boolean,
            default: () => false,
        },
        dark: {
            type: Boolean,
            default: () => false,
        },
        small: {
            type: Boolean,
            default: () => false,
        },
    },

    setup(props, context) {
        return {props, context};
    },

    render() {
        const header = h('thead', [
            h('tr', [
                this.props.fields.map(field => {
                    let fieldContainsLabel = Object.prototype.hasOwnProperty.call(field, 'label');
                    return h('th', {attrs: {class: 'header'}}, [
                        h('div', [fieldContainsLabel ? field.label : field.key]),
                    ]);
                }),
            ]),
        ]);

        const rows = this.props.items.map(item => {
            const cells = this.props.fields.map(field => {
                return h('td', item[field.key]);
            });
            return h('tr', [cells]);
        });

        const body = h('tbody', [rows]);

        return h('table', [header, body]);
        // let tableClassName = 'table b-table';
        // for (const [key, value] of Object.entries(this.props)) {
        //     if (key == 'items' || key == 'fields') {
        //         continue;
        //     }
        //     if (value) {
        //         console.log(value);
        //         if (key == 'small') {
        //             tableClassName += ' ' + 'table-sm';
        //         } else {
        //             tableClassName += ' ' + 'table-' + key;
        //         }
        //     }
        // }
        // /** @type {Item[]} */
        // const items = this.props.items;
        // /**@type {Field[]} */
        // const fields = this.props.fields;

        // const tableheader = h('thead', [
        //     h('tr', [
        //         fields.map(field => {
        //             let fieldContainsLabel = Object.prototype.hasOwnProperty.call(field, 'label');
        //             return h('th', {attrs: {class: 'header'}}, [
        //                 h('div', [fieldContainsLabel ? field.label : field.key]),
        //             ]);
        //         }),
        //     ]),
        // ]);
        // const tableRows = items.map(item => {
        //     const cells = fields.map(field => {
        //         let className = field.tdClass ? field.tdClass(item[field.key], field.key, item) : '';
        //         if (field.formatter) {
        //             return h(
        //                 'td',
        //                 {
        //                     on: {
        //                         click: () => {
        //                             if (this.attrs.listeners['row-clicked']) this.attrs.listeners['row-clicked'](item);
        //                         },
        //                     },
        //                     attrs: {
        //                         class: className,
        //                     },
        //                 },
        //                 [field.formatter(item[field.key], field.key, item)]
        //             );
        //         }
        //         if (this.context.slots[`cell(${field.key})`]) {
        //             return h('td', {attrs: {class: className}}, [
        //                 h('slot', [h('div', this.context.slots[`cell(${field.key})`](item))]),
        //             ]);
        //         }
        //         return h(
        //             'td', {onclick() {
        //                 console.log('hoi!');
        //             }},
        //             {
        //                 // on: {
        //                 //     click: () => {
        //                 //         if (this.attrs.listeners['row-clicked']) this.attrs.listeners['row-clicked'](item);
        //                 //     },
        //                 // },
        //                 attrs: {
        //                     class: className,
        //                 },
        //             },
        //             item[field.key]
        //         );
        //     });
        //     return h('tr', [cells]);
        // });
        // const tableBody = h('tbody', [tableRows]);
        // const minimalTable = h('table', {attrs: {class: this.tableClassName}}, [[tableheader], [tableBody]]);
        // return h('div', {attrs: {class: 'table-responsive'}}, [minimalTable]);
    },
};

export default VueFastTable;
