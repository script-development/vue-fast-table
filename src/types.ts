export interface Item {
    // A internal property we use to track the position of an item in a table using the vue :key property
    __id?: number | string;

    // Contains the field it's key
    // This property will be set automatically
    __key?: string;

    // Might contain the Item's context based on it's context
    // This value is mainly for internal use
    __context?: string;

    // Format the content of the item
    formatter?: (_item: Item) => any;

    // provide a item with a context (ONLY ALPHABETIC CHARACTERS AND _)
    // The __key will contain the field key
    getContext?: (_item: Item) => string;

    // The item it's data
    [key: string]: any;
}

export interface Field {
    // This field identifier
    key?: string;

    // Class(es) to add to every th element
    thClass?: (() => string[] | string) | string | string[];

    // Class(es) to add to every td element
    tdClass?: ((_item: Item) => string[] | string) | string | string[];

    // provide a item with a context (ONLY ALPHABETIC CHARACTERS AND _)
    getContext?: (_item: Item) => string;

    // Extra field data
    [key: string]: any;
}
