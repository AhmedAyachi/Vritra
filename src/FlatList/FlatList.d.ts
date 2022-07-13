

export default function FlatList(props:{
    parent:HTMLElement,
    id:String,
    /**
     * @deprecated
     * use id prop instead
     */
    ref:String,
    className:String,
    containerClassName:String,
    popupClassName:String,
    data:any[],
    horizontal:boolean,
    /**
     * Make Flatlist scrollable from bottom to top.
     * Specify a flatlist height value if elemnts get shown at once.
     * Should not be used with pagingEnabled true.
     */
    backwards:boolean,
    /**
     * Only with horizontal true.
     */
    pagingEnabled:boolean,
    /**
     * A number in range 0..1.
     * The visiblity fraction of an element in order to create the next one.
     * @example 
     * 0.5 => When half of the element is visible, the next one is created.
     * @default 0.5
     */
    threshold:Number,
    /**
     * Used with pagingEnabled true.
     * Specifies the transition animation from one element to the next
     */
    transition:String,
    renderItem(props:{parent:HTMLElement,item:any,index:Number,data:any[]}):HTMLElement,
    onSwipe(params:{direction:"left"|"right",index:Number,container:HTMLElement}):void,
    onReachEnd(container:HTMLElement):void,
}):FlatList;

interface FlatList extends HTMLElement{
    addItems(items:any[]):void,
    showItems(items:any[],renderItem:(props:{parent:HTMLElement,item:any,index:Number,data:any[]})=>HTMLElement):void,
    container:HTMLElement,
}
