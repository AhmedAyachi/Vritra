import {findItem} from "../index";


export default function withSequence(element,animations,callback){
    let start,index;
    const timers=[];
    animations.forEach((animation,i)=>{
        if(typeof(animation.duration)!=="number"){animation.duration=0};
        if(typeof(animation.delay)!=="number"){animation.delay=0};
        let timer=animation.delay;
        if(i){
            timer+=timers[i-1]+animations[i-1].duration;
        }
        timers.push(timer);
    });
    const lastIndex=animations.length-1;
    const endtime=timers[lastIndex]+animations[lastIndex].duration;
    const {style}=element,initialStyle={
        transitionDuration:style.transitionDuration||null,
        transitionTimingFunction:style.transitionTimingFunction||null,
    };
    const animator=(timestamp)=>{
        if(start===undefined){start=timestamp};
        const elpased=timestamp-start;
        if(elpased>endtime){
            Object.assign(style,initialStyle);
            callback&&callback();
        }
        else{
            const item=findItem(timers,(timer)=>elpased>=timer,true);
            if(item){
                const animindex=item.index;
                if(animindex!==index){
                    index=animindex;
                    const animation=animations[item.index];
                    style.transitionDuration=(animation.duration||0)+"ms";
                    style.transitionTimingFunction=animation.easing||"linear";
                    Object.assign(style,animation.toStyle);
                }
            }
            requestAnimationFrame(animator);
        }
    }
    requestAnimationFrame(animator);
}
