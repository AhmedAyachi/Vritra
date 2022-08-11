

export default class HashMap extends Map {
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

    get length(){
        return super.size;
    }

}
