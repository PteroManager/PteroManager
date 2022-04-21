
/**
 * @typedef {Class} Collection 
 */
class Collection extends Map {
    constructor(entries) {
        super();

        if (entries) {
            for (let entry of entries) {
                this.set(entry[0], entry[1]);
            }
        }
    }
    /**
     * Get the first entry value of the collection
     * @returns {any} The first entry value
     */
    getFirstEntry() {
        return this.values().next().value;
    }
}

module.exports = Collection;