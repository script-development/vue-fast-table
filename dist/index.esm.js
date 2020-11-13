import { h } from 'vue';

/**
 * @typedef {import('../types').Field} Field
 * @typedef {import('../types').Item} Item
 * @typedef {import('vue').ComponentObjectPropsOptions} ComponentObjectPropsOptions
 * @typedef {import('vue').Component} Component
 */

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

const buildRow = cells => {
    return h('tr', [cells]);
};

const getCell = (item, field, slots, emit) => {
    let className = field.tdClass ? field.tdClass(item[field.key], field.key, item) : '';
    let cellContent = '';
    if (field.formatter) {
        cellContent = field.formatter(item[field.key], field.key, item);
    } else if (slots.length) {
        cellContent = [h('div', [`${slots}cell(${field.key})`](item))];
    } else {
        cellContent = item[field.key];
    }
    return h('td', {class: className, onclick: () => emit('row-clicked', item)}, cellContent);
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
        const tableClassName = getTableClasses(props);

        return {props, context, tableClassName, getCell};
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
            const cells = this.fields.map(field => {
                let slots = this.context.slots[`cell(${field.key})`] ? this.context.slots[`cell(${field.key})`] : '';
                return this.getCell(item, field, slots, this.context.emit);
            });
            return buildRow(cells);
        });

        const body = h('tbody', [rows]);

        return h('table', {class: this.tableClassName}, [header, body]);
    },
};

export default VueFastTable;
