/*

function hashTable(table_size) {
    this.values = Array(table_size);
    for(i = 0; i < table_size; i++) {
        this.values[i] = [];
    }
    this.table_size = table_size;
}

hashTable.prototype.insert = function(value) {
    var hindex  = calDivHash(value, this.table_size);
    this.values[hindex].push(value);
};

function calcDivHash(k, table_size) {
    return k % table_size;
}

function displayHT(table) {
    displayHashTable(table);
}

*/