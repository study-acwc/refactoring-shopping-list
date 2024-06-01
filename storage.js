export class Storage {
    constructor() {
        this._storage = localStorage;
    }
}

const aStorage = new Storage();

export function rawDateOfStorage() { return aStorage._storage; }