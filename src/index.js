/**
 * @typedef {import('../types').Field} Field
 * @typedef {import('../types').Item} Item
 * @typedef {import('vue').ComponentObjectPropsOptions} ComponentObjectPropsOptions
 * @typedef {import('vue').Component} Component
 */

import {h} from 'vue';

/**
 * Get the table classes based on the given props
 * @param {ComponentObjectPropsOptions} props
 */
const getTableClasses = props => {
    let tableClassName = 'table b-table';
    for (const [key, value] of Object.entries(props)) {
        if (key == 'items' || key == 'fields' || !value) {
            continue;
        }

        if (key == 'small') {
            tableClassName += ' ' + 'table-sm';
        } else {
            tableClassName += ' ' + 'table-' + key;
        }
    }
    return tableClassName;
};

//  TODO :: dependant on Bootstrap CSS, either add that or add custom css
/** @type {Component} */
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
        console.log('setup');
        const rowClicked = item => context.emit('row-clicked', item);

        const tableClassName = getTableClasses(props);

        return {props, context, rowClicked, tableClassName};
    },

    render() {
        console.log('render');
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
                let className = field.tdClass ? field.tdClass(item[field.key], field.key, item) : '';

                if (field.formatter) {
                    return h('td', {class: className}, [field.formatter(item[field.key], field.key, item)]);
                }

                if (this.context.slots[`cell(${field.key})`]) {
                    return h('td', {attrs: {class: className}}, [
                        h('slot', [h('div', this.context.slots[`cell(${field.key})`](item))]),
                    ]);
                }

                return h(
                    'td',
                    {
                        class: className,
                        onclick: () => {
                            this.rowClicked(item);
                        },
                    },
                    item[field.key]
                );
            });
            return h('tr', [cells]);
        });

        const body = h('tbody', [rows]);

        return h('table', {class: this.tableClassName}, [header, body]);
    },
};

export default VueFastTable;
