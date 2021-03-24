export interface Item {
    __id?: number | string;
    formatter?: (_item: Item) => any;
}
export interface Field {
    key?: string;
    thClass?: (() => string[] | string) | string | string[];
    tdClass?: ((_item: Item) => string[] | string) | string | string[];
}
