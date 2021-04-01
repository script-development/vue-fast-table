export interface Item {
    // The item it's data
    [key: string]: any;

    // provide a item with a context (ONLY ALPHABETIC CHARACTERS AND _)
    // item.__key can be used to identify the field
    getContext?: (_item: Item) => string;

    // A internal property we use to track the position of an item in a table using the vue :key property
    __id?: number | string;
    // Contains the field it's key
    // This property will be set automatically
    __key?: string;
    // Might contain the Item's context based on it's context
    // This value is mainly for internal use
    __context?: string;
}

export interface Field {
    // The field identifier
    key?: string;
    // The visual name of the field
    label?: string;

    // Format the content of the item
    formatter?: (_item: Item) => any;
    // Class(es) to add to every th element
    thClass?: (() => string[] | string) | string | string[];
    // Class(es) to add to every td element
    tdClass?: ((_item: Item) => string[] | string) | string | string[];
    // provide a item with a context (ONLY ALPHABETIC CHARACTERS AND _)
    getContext?: (_item: Item) => string;
    // Extra field data
    [key: string]: any;
}
