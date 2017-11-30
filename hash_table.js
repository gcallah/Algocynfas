function hashTable(table_size) {
    this.values = Array(table_size);
    for(i = 0; i < table_size; i++) {
        this.values[i] = [];
    }
    this.numberOfValues = 0;
    this.table_size = table_size;
}

hashTable.prototype.insert = function(value) {
    var hindex  = calDivHash(value, this.table_size);
    this.numberOfValues++;
    this.values[hindex].push(value);
    this.values[hindex].length === 0 ?
        this.values[hindex].push(hindex, value) :
        this.values[hindex].push(value);
};

function calDivHash(k, table_size) {
    return k % table_size;
}

function displayHT(table) {
  displayHashTable(table);
}
