import {removeItem} from "../index";


export default class FooMap extends Map {
    constructor(params){
        super(params);
    }

    at(index,isValue=false){
        let item;
        if((-1<index)&&(index<super.size)){
            const items=super[isValue?"values":"keys"]();
            let i=0;
            while(i<index){
                items.next();
                i++;
            }
            item=items.next().value;
        }
        return item;
    }

    indexOf(item,isValue=false){
        let found=false;
        const iterator=isValue?this.valueIterator():this.keyIterator();
        while((!found)&&iterator.hasNext()){
            const next=iterator.next();
            if(next===item){
                found=true;
            }
        }
        return found?iterator.currentIndex():-1;
    }

    keys(){
        return Object.freeze([...super.keys()]);
    }

    values(){
        return Object.freeze([...super.values()]);
    }

    keyIterator(){
        return new FooIterator([...super.keys()]);
    }

    valueIterator(){
        return new FooIterator([...super.values()]);
    }

    entries(){
        const entries=Object.freeze([...super.entries()]);
        for(const entry of entries){
            Object.freeze(entry);
        }
        return entries;
    }

    valueIterableIterator(){
        return super.values();
    }
    valuesAsIterableIterator(){//deprecated
        return super.values();
    }

    keyIterableIterator(){
        return super.keys();
    }
    keysAsIterableIterator(){//deprecated
        return super.keys();
    }

    entryIterableIterator(){
        return super.entries();
    }
    entriesAsIterableIterator(){//deprecated
        return super.entries();
    }

    get length(){
        return super.size;
    }

}

class FooIterator {
    #items;#index=-1;#current=null;

    constructor(items){
        this.#items=items;
    }
    
    next(){
        this.#index++;
        if(this.#index<this.#items.length){
            this.#current=this.#items[this.#index];
            return this.#current;
        }
        else throw new Error("no such item");
    }

    current(){
        return this.#current;
    }

    currentIndex(){
        return this.#index;
    }

    hasNext(){
        const {length}=this.#items;
        return (length>0)&&(this.#index<(length-1));
    }

    remove(){
        if(this.#index>=0){
            const removed=removeItem(this.#items,this.#current);
            this.#index--;
            this.#current=this.#index>=0?this.#items[this.#index]:null;
            return removed;
        }
        else throw new Error("no item to remove");
    }
}
