import {View,ExtendableViewProps} from "../View/View";
import {SwipeEvent} from "../Gestures/useSwipeGesture/useSwipeGesture";


export default function FlatList<Type>(props:FlatListProps<Type>):FlatList<Type>;

type FlatListProps<Type>=ExtendableViewProps<"div">&{
    containerClassName?:string,
    popupClassName?:string,
    /**
     * Flatlist data array
     * 
     * Items should be unique
     * 
     * The flatlist doesn't use this array but its shallow copy
     */
    data?:Type[],
    /**
     * @notice Do not forget to set the item element display to inline 
     */
    horizontal?:boolean,
    /**
     * Make Flatlist scrollable from bottom/right to top/left.
     * 
     * @notice Specify a flatlist height value if elements get shown at once.
     */
    backwards?:boolean,
    /**
     * The visiblity fraction of an element in order to render the next one.
     * A number in range 0..1
     * @example 
     * 0.5 => When half of the element is visible, the next one is rendered.
     * @default 0.5
     */
    threshold?:number,
    /**
     * specifies how many items should be rendered 
     * once the user has reached the last rendered item
     * @default 1
     */
    step?:number,
    /**
     * Item element should have a specified height/width value (depending on the horizontal prop value)
     * for the paging to function properly
     * @notice automatically sets snapToItems to true
     */
    pagingEnabled?:boolean,
    /**
     * @default false
     * @notice may not work properly on browser device emulators
     */
    smoothPaging?:boolean,
    /**
     * specifies the required visibility threshold in pixels for scrolling to an item
     * @notice used when smoothPaging is enabled
     * @default 100
     */
    offsetThreshold?:number,
    /**
     * When false, the flatlist cannot be scrolled via touch interaction
     * @default true
     */
    scrollEnabled?:boolean,
    /**
     * Used with pagingEnabled true.
     * Specifies the transition animation from one element to the next
     * @default "ease 300ms"
     */
    pagingTransition?:string;
    /**
     * @deprecated use pagingTransition instead
     */
    transition?:string,
    /**
     * When true, causes the flatlist to scroll to the nearest item element.
     * @default false 
     */
    snapToItems?:boolean,
    /**
     * Rendered when the flatlist is empty.
     * @notice displays a simple message if a string is passed
     * @default "no data"
     */
    EmptyComponent?:string|(({parent:HTMLElement})=>HTMLElement),
     /**
      * Function to execute on each data item
      * 
      * Must return an HTMLElement
      * @param props component props
      */
    renderItem(props:{
        parent:HTMLDivElement,
        item:Type,
        index:number,
        data:Type[],
    }):HTMLElement,
    /**
     * Used with pagingEnabled true.
     * @param params 
     * @notice only called when an actual swipe gesture is detected
     * @deprecated use onInFocusItemChange instead
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
     * Called once the list element is filled
     * @param data about the item that filled the list
     */
    onFilled(data:ItemData<Type>&{index:number}):void,
    /**
     * called when the item in focus has changed
     */
    onInFocusItemChange(data:ItemData<Type>&{index:number}):void,
    /**
     * Triggered when the last data item is reached
     * @param context 
     */
    onReachEnd(context:{
        data:Type[],
        container:HTMLElement,
    }):void,
}

type PopupProps<Type>=Omit<FlatListProps<Type>,"at"|"containerClassName"|"popupClassName"|"data">

type FlatList<Type>=View<"div">&{
    /**
     * Scrolls to a specific content pixel offset in the list
     * @param offset 
     * @param smooth default: true
     */
    scrollToOffset(offset:number,smooth?:boolean):void,
    /**
     * Returns the flatlist items container element 
     */
    readonly container:HTMLDivElement,
    /**
     * Scrolls to item at index
     * @param index 
     * @param smooth default: true
     */
    scrollToIndex(index:number,smooth?:boolean):void,
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
    removeItem(predicate:(item:Type,index?:number,data?:Type[])=>boolean,withElement?:boolean):ItemData<Type>,
    /**
     * Removes item if found
     * @param item item to remove
     * @param withElement if true removes the html element associated with the item. Default: true
     * @returns the removed data {item,element}
     */
    removeItem(item:any,withElement?:boolean):ItemData<Type>,
    /**
     * Creates a flatlist on top of the original flatlist as a popup using the same props
     * @param items data to show
     * @param props Popup Flatlist props
     * @returns The flatlist popup element if created, null otherwise.
     * @notice
     * onReachEnd and onRemoveItem props are not passed to the popup faltlist.
     * If items is not an array, The method removes the popup flatlist.
     */
    showItems<Type>(items:Type[],props?:PopupProps<Type>):FlatList<Type>|null,
    /**
     * Creates a flatlist on top of the original flatlist as a popup using the same props
     * @param predicate function to execute to filter items
     * @param props Popup Flatlist props
     * @returns The flatlist popup element if created, null otherwise.
     * @notice
     * onReachEnd and onRemoveItem props are not passed to the popup faltlist.
     * If items is not an array, The method removes the popup flatlist.
     */
    showItems<Type>(predicate:(item:Type,index:number)=>Boolean,props?:PopupProps<Type>):FlatList<Type>|null,
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
    /**
     * In focus item index
     */
    readonly index:number,
    readonly container:HTMLDivElement,
}
