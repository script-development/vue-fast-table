Vue Fast Table

Vue Fast Table is a functional component for displaying tabular data. It is designed as a functional component written in Javascript to be used with VueJS. Currently, it supports the following props: 

# Fields
Fields is an array that contains objects used to build the table. Each individual field can contain a key, used to identify a value in an item, and a label that is used to generate the table's headers. 

Example: 
fields = [
    {
        key: 'first_name',
        label: 'Name',
    },
    {
        key: 'dob',
        label: 'Date of birth'
    }
]

The array above will generate a table containing two rows, one displaying "Name" and the other displaying "Date of birth".

# Items

The actual table data is contained in items. An array of items can look like this:
items = [
{
    first_name: 'Harry',
    dob: '14-03-1948'
},
{
    first_name: 'Sally',
    dob: '19-11-1961'
}
]

When combined with the fields defined above, this will result in a table that looks like this:

Name    Date of birth
Harry   14-03-1948
Sally   19-11-1961

An item may also contain a formatter. A formatter is a function that can be used to dynamically alter data. We could, for example, add a formatter to the fields we defined earlier:

items = [
    {
        key: 'first_name',
        label: 'Name',
        formatter: (name, first_name, item) => {
            return first_name + ' is a name'
        }
    },
    {
        key: 'dob',
        label: 'Date of birth'
    }
]

This results in the following table:

Name              Date of birth
Harry is a name   14-03-1948
Sally is a name   19-11-1961

Finally, a tdClass can be added to items to specify a class for a td. An example:
tdClass
fields = [
    {
        key: 'first_name',
        label: 'Name',
        tdClass: 'blue'
    },
    {
        key: 'dob',
        label: 'Date of birth'
    }
]

When the tdClass has been defined like this, all td's in the 'Name' row will have a classname 'blue'. A tdClass can also be generated dynamically:
fields = [
    {
        key: 'first_name',
        label: 'Name',
        tdClass: (name, first_name, items) =>  {
            if (name.startsWith('S')) {
                return 'Sally';
            } 
            return Harry;
        }
    },
    {
        key: 'dob',
        label: 'Date of birth'
    }
]

In this scenario, all cells containing a name starting with S will have the class 'Sally' and all other cells will have the class 'Harry'. 








