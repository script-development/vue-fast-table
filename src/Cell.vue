<template>
    <td
        role="cell"
        :class="classes"
        @click="$emit('click', extendedItem)"
        @dblclick="$emit('dblclick', extendedItem)"
    >
        <template v-if="field.formatter">
            {{ formatted }}
        </template>
        <slot
            v-else
            name="default"
            v-bind="extendedItem"
        />
    </td>
</template>

<script lang="ts">
import {PropType} from 'vue';
import {Field, Item} from './types';

export default {
    name: 'Cell',
    props: {
        item: {
            type: Object as PropType<Item>,
            required: true,
        },
        field: {
            type: Object as PropType<Field>,
            required: true,
        },
        getContext: {
            type: Function as PropType<(_item: Item) => string>,
            default: undefined,
        },
    },
    computed: {
        formatted() {
            return this.field.formatter(this.extendedItem);
        },
        extendedItem() {
            const item = {...this.item};
            item.__key = this.field.key;

            if (this.getContext) {
                item.__context = this.getContext(item);
            } else if (this.field?.getContext) {
                item.__context = this.field.getContext(item);
            } else if (item?.getContext) {
                item.__context = item.getContext(item);
            }

            return item;
        },
        classes() {
            const tdClass = this.field.tdClass;
            const item = this.extendedItem;

            let className = tdClass ? (typeof tdClass == 'function' ? tdClass(item) : tdClass) : '';
            if (Array.isArray(className)) {
                className = className.join(' ');
            }

            if (item.__context) {
                className += ` context_${item.__context}`;
            }

            return className.trim();
        },
    },
};
</script>
