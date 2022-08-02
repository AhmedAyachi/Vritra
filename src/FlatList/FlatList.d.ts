import {View} from "../View/View";


export default function FlatList<type>(props:{
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
    data:type[],
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
    renderItem(props:{parent:HTMLElement,item:type,index:Number,data:type[]}):HTMLElement,
    onSwipe(params:{direction:"left"|"right",index:Number,container:HTMLElement}):void,
    onReachEnd(params:{parent:HTMLElement,data:type[]}):void,
}):FlatList;

interface FlatList extends View {
    addItems(items:any[]):void,
    /**
     * Creates a flatlist on top of the original flatlist
     * @param items data to show
     * @param renderItem function component to use
     */
    showItems<type>(items:type[],renderItem?:(props:{parent:HTMLElement,item:type,index:Number,data:type[]})=>HTMLElement):void,
    showItems<type>(predicate:(item:type,index:Number,array:type[])=>Boolean,renderItem?:(props:{parent:HTMLElement,item:type,index:Number,data:type[]})=>HTMLElement):void,
    readonly container:HTMLElement,
}
