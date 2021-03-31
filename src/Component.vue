<template>
    <div class="table-responsive">
        <table
            :id="id"
            :class="tableClassName"
        >
            <thead role="rowgroup">
                <tr role="row">
                    <th
                        v-for="field of fields"
                        :key="field.key"
                        :class="'header ' + parseClasses(field.thClass)"
                        role="columnheader"
                    >
                        <slot
                            v-bind="field"
                            :name="headSlotName"
                        >
                            <div>
                                {{ field.label || field.key }}
                            </div>
                        </slot>
                    </th>
                </tr>
            </thead>

            <tbody role="rowgroup">
                <tr
                    v-if="busy"
                    class="b-table-busy-slot"
                    role="row"
                >
                    <td
                        :colspan="fields.length"
                        role="cell"
                    >
                        <slot name="table-busy">
                            <div class="text-center text-danger my-2">
                                <span
                                    aria-hidden="true"
                                    class="align-middle spinner-border"
                                />
                                <strong>Loading...</strong>
                            </div>
                        </slot>
                    </td>
                </tr>

                <tr
                    v-else-if="sortedItems.length == 0"
                    class="b-table-empty-slot"
                    role="row"
                >
                    <td
                        :colspan="fields.length"
                        role="cell"
                    >
                        <slot
                            name="table-empty"
                        />
                    </td>
                </tr>

                <slot
                    v-for="item of sortedItems"
                    v-else
                    name="row"
                    v-bind="item"
                >
                    <tr
                        :key="item.__id"
                        class="b-table-data"
                        role="row"
                        @click="$emit('row-clicked', item)"
                    >
                        <Cell
                            v-for="field of fields"
                            :key="field.key"
                            :item="item"
                            :field="field"
                            :get-context="getContext"
                            @click="$emit('cell-click', $event)"
                            @dblclick="$emit('cell-dblclick', $event)"
                        >
                            <template #default="extendedItem">
                                <slot
                                    v-bind="extendedItem"
                                    :name="getSlotName(extendedItem)"
                                >
                                    {{ item[field.key] || '' }}
                                </slot>
                            </template>
                        </Cell>
                    </tr>
                </slot>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import {PropType} from 'vue';
import {Field, Item} from './types';
import Cell from './Cell.vue';

const propToClassKeys = ['borderless', 'hover', 'outlined', 'bordered', 'striped', 'dark', 'small', 'busy'];

//  TODO :: dependant on Bootstrap CSS, either add that or add custom css
export default {
    name: 'VueFastTable',
    components: {Cell},
    props: {
        items: {
            type: Array as PropType<Item[]>,
            default: () => [],
        },
        fields: {
            type: Array as PropType<Field[]>,
            default: () => [],
        },
        borderless: {
            type: Boolean,
            default: true,
        },
        hover: {
            type: Boolean,
            default: false,
        },
        outlined: {
            type: Boolean,
            default: false,
        },
        bordered: {
            type: Boolean,
            default: false,
        },
        striped: {
            type: Boolean,
            default: false,
        },
        dark: {
            type: Boolean,
            default: false,
        },
        small: {
            type: Boolean,
            default: false,
        },
        sort: {
            type: String as PropType<'ascending' | 'descending'>,
            default: 'ascending',
        },
        sortBy: {
            type: String,
            default: undefined,
        },
        id: {
            type: String,
            default: undefined,
        },
        busy: {
            type: Boolean,
            default: false,
        },
        // provide a item with a context (ONLY ALPHABETIC CHARACTERS AND _)
        // The __key will contain the field key
        getContext: {
            type: Function as PropType<(_item: Item) => string>,
            default: undefined,
        },
    },

    data() {
        return {
            sortedItems: [] as Item[],
        };
    },

    computed: {
        tableClassName() {
            let tableClassName = 'table b-table';

            for (const key of propToClassKeys) {
                const value = this[key];
                if (value) {
                    tableClassName += ' table-' + (key == 'small' ? 'sm' : key);
                }
            }

            return tableClassName;
        },
        headSlotName() {
            return this.$scopedSlots['head()'] ? 'head()' : 'head';
        },
    },

    watch: {
        items() {
            this.sortItems();
        },
        sortBy(newVal, oldVal) {
            if (newVal != oldVal) {
                this.sortItems();
            }
        },
        sort(newVal, oldVal) {
            if (newVal != oldVal) {
                this.sortItems();
            }
        },
        fields() {
            this.sortItems();
        },
    },

    beforeMount() {
        this.sortItems();
    },

    methods: {
        getSlotName(item: Item) {
            let name;

            const context = item.__context;
            if (context) {
                name = `cell(${item.__key})@${context}`;
                if (this.$scopedSlots[name]) {
                    return name;
                }
            }

            name = `cell(${item.__key})`;
            if (this.$scopedSlots[name]) {
                return name;
            }

            if (context) {
                name = `cell()@${context}`;
                if (this.$scopedSlots[name]) {
                    return name;
                }

                name = `cell@${context}`;
                if (this.$scopedSlots[name]) {
                    return name;
                }
            }

            return this.$scopedSlots[`cell()`] ? `cell()` : `cell`;
        },
        sortItems() {
            const items = [...this.items];

            // sort items when a sortBy prop was passed
            if (this.sortBy && items.length > 1) {
                items.sort((a, b) => {
                    const field = this.fields.find(f => f.key === this.sortBy);
                    let item1, item2;
                    if (field && field.formatter) {
                        item1 = field.formatter(a[this.sortBy], this.sortBy, a);
                        item2 = field.formatter(b[this.sortBy], this.sortBy, b);
                    } else if (typeof a[this.sortBy] === 'string') {
                        item1 = a[this.sortBy].toUpperCase();
                        item2 = b[this.sortBy].toUpperCase();
                    } else {
                        item1 = a[this.sortBy];
                        item2 = b[this.sortBy];
                    }
                    let comparison = 0;
                    if (item1 > item2) {
                        comparison = 1;
                    } else if (item2 > item1) {
                        comparison = -1;
                    } else {
                        comparison = 0;
                    }
                    if (this.sort == 'descending') {
                        comparison *= -1;
                    }
                    return comparison;
                });
            }
            this.sortedItems = items.map<Item>((item, idx) => ({__id: idx, ...item}));
        },
        parseClasses(input: (() => string | string[]) | string | string[]) {
            let className = input ? (typeof input == 'function' ? input() : input) : '';

            if (Array.isArray(className)) {
                className = className.join(' ');
            }

            return className.trim();
        },
    },
};
</script>
