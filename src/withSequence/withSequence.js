import {findItem} from "../index";


export default function withSequence(element,animations,callback){
    let start,index;
    const timers=[];
    animations.forEach((animation,i)=>{
        timers.push(animation.duration+(i?timers[i-1]:0));
    });
    const {style}=element,initialStyle={
        transitionDuration:style.transitionDuration||null,
        transitionTimingFunction:style.transitionTimingFunction||null,
    };
    const animator=(timestamp)=>{
        if(start===undefined){start=timestamp};
        const elpased=timestamp-start;
        const item=findItem(timers,(timer)=>timer>=elpased);
        if(item){
            const animindex=item.index;
            if(animindex!==index){
                index=animindex;
                const animation=animations[item.index];
                style.transitionDuration=(animation.duration||0)+"ms";
                style.transitionTimingFunction=animation.easing||"linear";
                Object.assign(style,animation.style);
            }
            requestAnimationFrame(animator);
        }
        else{
            Object.assign(style,initialStyle);
            callback&&callback();
        }
    }
    requestAnimationFrame(animator);
}
