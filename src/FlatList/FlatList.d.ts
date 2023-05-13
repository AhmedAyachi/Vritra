import {View,ViewProps} from "../View/View";
import {SwipeEvent} from "../Gestures/useSwipeGesture";


export default function FlatList<Type>(props:FlatListProps<Type>):FlatList<Type>;

interface FlatList<Type> extends View {
    /**
     * Scrolls to a specific content pixel offset in the list
     * @param offset 
     * @param smooth default: true
     */
    scrollToOffset(offset:number,smooth:boolean):void,
    /**
     * Returns the flatlist items container element 
     */
    readonly container:HTMLElement,
    /**
     * Scrolls to item at index
     * @param index 
     * @param smooth default: true
     */
    scrollToIndex(index:number,smooth:boolean):void,
    /**
     * Appends more data items to the data array
     * @param items 
     */
    addItems(items:Type[]):void,
    /**
     * removeItem calls predicate once for each element of the data array, in ascending order, 
     * until it finds one where predicate returns true. If such item is found, it's removed.
     * @param predicate function used to find the item.
     * @param withElement if true removes the html element associated with the item. Default: true.
     * @returns the removed data {item,element}
     */
    removeItem(predicate:(item:Type,index:Number,data:Type[])=>Boolean,withElement:boolean):ItemData<Type>,
    /**
     * Removes item if found
     * @param item item to remove
     * @param withElement if true removes the html element associated with the item. Default: true
     * @returns the removed data {item,element}
     */
    removeItem(item:any,withElement:boolean):ItemData<Type>,
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
    showItems<Type>(predicate:(item:Type,index:Number,data:Type[])=>Boolean,props?:PopupProps<Type>):FlatList<Type>|null,
}

type PopupProps<Type>=ViewProps&{
    /**
     * @see Do not forget to set the item element display to inline 
     */
    horizontal:boolean,
    /**
     * Message to show when the flatlist is empty.
     * @default "no data"
     */
    emptymessage:string,
    /**
     * Make Flatlist scrollable from bottom to top.
     * Specify a flatlist height value if elements get shown at once.
     * Still not supported with pagingEnabled true.
     */
    backwards:boolean,
    /**
     * Item element should have a specified height/width value (depending on the horizontal prop value)
     * for the paging to function properly
     */
    pagingEnabled:boolean,
    /**
     * When false, the flatlist cannot be scrolled via touch interaction
     * @default true
     */
    scrollEnabled:boolean,
    /**
     * A number in range 0..1.
     * The visiblity fraction of an element in order to create the next one.
     * @example 
     * 0.5 => When half of the element is visible, the next one is created.
     * @default 0.5
     */
    threshold:number,
    /**
     * Used with pagingEnabled true.
     * Specifies the transition animation from one element to the next
     * @default "250ms"
     */
    transition:string,
     /**
      * Function to execute on each data item
      * 
      * Must return a HTMLElement
      * @param props component props
      */
    renderItem(props:{
        parent:HTMLDivElement,
        item:Type,
        index:Number,
        data:Type[],
    }):HTMLElement,
    /**
     * Used with pagingEnabled true.
     * @param params 
     */
    onSwipe(event:FlatListSwipeEvent):void,
    /**
     * Triggered each time addItems method called;
     * @param items added items array
     */
    onAddItems(items:Type[]):void,
     /**
      * Triggered each time removeItem method called;
      * @param data
      */
    onRemoveItem(data:ItemData<Type>):void,
    /**
     * Triggered when the last data item is reached
     * @param context 
     */
    onReachEnd(context:{container:HTMLElement,data:Type[]}):void,
}

type FlatListProps<Type>=PopupProps<Type>&{
    containerClassName:string,
    popupClassName:string,
    /**
     * Flatlist data array
     * 
     * Items should be unique
     * 
     * The flatlist doesn't use this array but its shallow copy
     */
    data:Type[],
}

type ItemData<Type>={
    /**
     * Data item 
     */
    item:Type,
    /**
     * HTML Element associated with the item.
     * null if Element has not been created yet.
     */
    element:HTMLElement|null,
}

type FlatListSwipeEvent=SwipeEvent&{
    readonly index:Number,
    readonly container:HTMLDivElement,
}
