import {ExtendableViewProps,View} from "../View/View";

/**
 * A self-position-adjustment view
 * @param props 
 */
export default function PopupView(props:ExtendableViewProps<"div">&{
    /**
     * Near which the popupview is shown
     */
    target?:HTMLElement,
    /**
     * If target is specified, parent is the element relative to which the PopupView will adjust its position 
     * @default document.documentElement
     */
    parent?:HTMLElement,
    /**
     * Unmounts the popupview on outside click
     * @default true
     */
    avoidable?:boolean,
    /**
     * If true, unmounting will not cleanup the event listeners nor remove the popupview from DOM
     * @default false
     */
    keepinDOM?:boolean,
    onUnmount():void,

}):PopupView;


type PopupView=View<"div">&{
    /**
     * Cleans up the added event listeners
     */
    cleanupEventListeners():void,
    /**
     * Cleans up the event listeners and removes the popupview from DOM
     */
    unmount():void,
}
