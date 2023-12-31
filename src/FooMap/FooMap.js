

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

    keys(){
        return Object.freeze([...super.keys()]);
    }

    values(){
        return Object.freeze([...super.values()]);
    }

    entries(){
        const entries=Object.freeze([...super.entries()]);
        entries.forEach(Object.freeze);
        return entries;
    }

    valuesAsIterableIterator(){
        return super.values();
    }

    keysAsIterableIterator(){
        return super.keys();
    }

    entriesAsIterableIterator(){
        return super.entries();
    }

    get length(){
        return super.size;
    }

}
