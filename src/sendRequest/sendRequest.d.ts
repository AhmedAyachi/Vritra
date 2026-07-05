

export default function sendRequest(
    url:string,
    options?:{
        /**
         * @default "GET"
         */
        method?:string,
        /**
         * for non-string values, the body is stringified.
         */
        body?:any,
        headers?:[string:any],
        /**
         * Url search params
         */
        searchParams?:[string:string],
        /**
         * In milliseconds
         * @default 3000
         * @notice 0 to disable.
         */
        timeout?:number,
        /**
         * An AbortSignal.
         */
        signal?:AbortSignal,
        /**
         * @default false
         */
        withCredentials?:boolean,
    },
):Promise<Response>;
