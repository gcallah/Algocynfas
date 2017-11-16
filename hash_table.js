function hashTable(ts) {
    this.values = Array(5);
    for(i = 0; i < ts; i++) {
        this.values[i] = i;
    }
    this.numberOfValues = 0;
    this.ts = ts;
}

hashTable.prototype.insert = function(value) {
    var hindex  = calDivHash(value, this.ts);
    if(this.values[hindex] === hindex) {
       this.values[hindex] = [];
    }
    this.numberOfValues++;
    this.values[hindex].length === 0 ? this.values[hindex].push(hindex, value) : this.values[hindex].push(value);
};

function calDivHash(k, ts) {
    return k % ts;
}

function displayHT(table){
  displayHashTable(table);
}
