import { PropType } from 'vue';
import { Field, Item } from './types';
declare const _default: {
    name: string;
    props: {
        item: {
            type: PropType<Item>;
            required: boolean;
        };
        field: {
            type: PropType<Field>;
            required: boolean;
        };
        getContext: {
            type: PropType<(_item: Item) => string>;
            default: any;
        };
    };
    computed: {
        formatted(): any;
        extendedItem(): any;
        classes(): any;
    };
};
export default _default;
