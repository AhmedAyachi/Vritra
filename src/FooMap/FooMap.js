import {removeItem} from "../index";


export default class FooMap extends Map {

    #onChange
    constructor(param,options){
        super();
        if(Array.isArray(param)){
            for(const pair of param){
                if(Array.isArray(pair)) super.set(pair[0],pair[1]);
                else throw new Error(`Iterator value ${pair} is not an entry object`);
            }
        }
        else if(param) throw new new Error("param 1 must be an array of key,value pairs");
        const {onChange}=options||{};
        if(typeof(onChange)==="function") this.#onChange=onChange.bind(this);
        else this.#onChange=null;
    }

    set(key,value){
        super.set(key,value);
        this.#onChange?.();
    }

    delete(key){
        super.delete(key);
        this.#onChange?.();
    }

    clear(){
        super.clear();
        this.#onChange?.();
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

    keyIterableIterator(){
        return super.keys();
    }

    entryIterableIterator(){
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
        const lastIndex=this.#items.length-1;
        this.#current=this.#items[this.#index];
        return {
            done:this.#index>=lastIndex,
            value:this.current,
        }
    }

    get current(){ return this.#current; };

    get currentIndex(){ return this.#index; }

    get hasNext(){
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
