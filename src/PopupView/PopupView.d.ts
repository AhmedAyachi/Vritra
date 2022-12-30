import {ViewProps,View} from "../View/View";


export default function PopupView(props:ViewProps&{
    /**
     * Near which the popupview is shown
     * @see If target is specified, parent prop is ignored and target.parentNode is used instead
     */
    target?:HTMLElement,
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


interface PopupView extends View {
    /**
     * Cleans up the added event listeners
     */
    cleanupEventListeners():void,
    /**
     * Cleans up the added event listeners and removes the popupview from DOM
     */
    unmount():void,
}
