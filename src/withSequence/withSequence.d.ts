

/**
 * Runs the provided animations in a sequence
 */
export default function withSequence(
    element:HTMLElement,
    animations:{
        style:withSequenceAnimationStyle,
        /**
         * Animation duration in milliseconds
         * @default 0
         */
        duration:number,
        /**
         * Animation delay in milliseconds
         * @default 0
         */
        delay:number,
        /**
         * @default "linear"
         */
        easing:Easing,
    }[],
    callback:()=>void,
):void;

type withSequenceAnimationStyle=Omit<
    CSSStyleDeclaration,
    "transition"|"transition-delay"|"transition-duration"|"transition-property"|"transition-timing-function"
>;

type Easing="ease"|"ease-in"|"ease-out"|"linear"|"ease-in-out"|"step-start"|"step-end"|"cubic-bezier( , , , )"|"steps(,)";