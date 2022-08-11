import {View} from "../View/View";


export default function FlatList<Type>(props:FlatListProps<Type>):FlatList<Type>;

interface FlatList<Type> extends View {
    addItems(items:Type[]):void,
    /**
     * removeItem calls predicate once for each element of the data array, in ascending order, 
     * until it finds one where predicate returns true. If such item is found, it's removed.
     * @param predicate function used to find the item.
     * @param withElement if true removes the html element associated with the item. Default: true.
     */
    removeItem(predicate:(item:Type,index:Number,array:Type[])=>Boolean,withElement:Boolean=true):RemovedData<Type>,
    /**
     * Removes item if found
     * @param item item to remove
     * @param withElement if true removes the html element associated with the item. Default: true
     */
    removeItem(item:any,withElement:Boolean=true):RemovedData<Type>,
    /**
     * Creates a flatlist on top of the original flatlist as a popup using the same props
     * @param items data to show
     * @param props Popup Flatlist props
     * @returns The flatlist popup element if created, null otherwise.
     * @see
     * onReachEnd and onRemoveItem props are not passed to the popup faltlist.
     * If items is not an array, The method removes the popup flatlist.
     */
    showItems<Type>(items:Type[],props?:PopupProps<Type>):FlatList<Type>|null,
    /**
     * Creates a flatlist on top of the original flatlist as a popup using the same props
     * @param predicate function to execute to filter items
     * @param props Popup Flatlist props
     * @returns The flatlist popup element if created, null otherwise.
     * @see
     * onReachEnd and onRemoveItem props are not passed to the popup faltlist.
     * If items is not an array, The method removes the popup flatlist.
     */
    showItems<Type>(predicate:(item:Type,index:Number,array:Type[])=>Boolean,props?:PopupProps<Type>):FlatList<Type>|null,
    /**
     * Returns the popup flatlist 
     */
    readonly container:HTMLElement,
}

type PopupProps<Type>={
    id:String,
    /**
     * @deprecated
     * use id prop instead
     */
    ref:String,
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
    renderItem:renderItem<Type>,
    onSwipe(params:{direction:"left"|"right",index:Number,container:HTMLElement}):void,
    /**
     * Triggered each time addItems method called;
     * @param items 
     */
    onAddItems(items:Type[]):void,
     /**
      * Triggered each time removeItem method called;
      * @param params
      */
    onRemoveItem(params:RemovedData<Type>):void,
    onReachEnd(params:{parent:HTMLElement,data:Type[]}):void,
}

type FlatListProps<Type>=PopupProps<Type>&{
    parent:HTMLElement,
    className:String,
    containerClassName:String,
    popupClassName:String,
    /**
     * Flatlist data array.
     * The flatlist doesn't use this array but its shallow copy.
     */
    data:Type[],
}

type RemovedData<Type>={
    /**
     * Data item 
     */
    item:Type,
    /**
     * HTML Element associated with item.
     * null if Element has not been created yet.
     */
    element:HTMLElement|null,
}

type renderItem<Type>=(props:{parent:HTMLElement,item:Type,index:Number,data:Type[]})=>HTMLElement;
