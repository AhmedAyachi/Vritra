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
    /**
     * Flatlist data array.
     * The flatlist doesn't use this array but retrieves its initial data from it. 
     */
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
    /**
     * Function to execute on each data item
     * @param props 
     */
    renderItem(props:{parent:HTMLElement,item:type,index:Number,data:type[]}):HTMLElement,
    onSwipe(params:{direction:"left"|"right",index:Number,container:HTMLElement}):void,
    onReachEnd(params:{parent:HTMLElement,data:type[]}):void,
}):FlatList;

interface FlatList extends View {
    addItems(items:any[]):void,
    /**
     * Creates a flatlist on top of the original flatlist as a popup
     * @param items data to show
     * @param renderItem function component to use
     * @returns The flatlist popup element if created, null otherwise
     */
    showItems<type>(items:type[],renderItem?:(props:{parent:HTMLElement,item:type,index:Number,data:type[]})=>HTMLElement):FlatList|null,
    /**
     * Creates a flatlist on top of the original flatlist as a popup
     * @param predicate function to execute to filter items
     * @param renderItem function component to use
     * @returns The flatlist popup element if created, null otherwise
     */
    showItems<type>(predicate:(item:type,index:Number,array:type[])=>Boolean,renderItem?:(props:{parent:HTMLElement,item:type,index:Number,data:type[]})=>HTMLElement):FlatList|null,
    /**
     * Returns the popup flatlist 
     */
    readonly container:HTMLElement,
}
