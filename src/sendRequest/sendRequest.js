

export default (url,options)=>new Promise((resolve,reject)=>{
    const {method,headers,body,searchParams,timeout=3000,signal}=options||{};
    const request=new XMLHttpRequest();
    request.withCredentials=Boolean(options.withCredentials);
    const requestUrl=new URL(url);
    if(searchParams) for(const key in searchParams){
        requestUrl.searchParams.set(key,searchParams[key]);
    }
    request.open(method||"GET",requestUrl);
    for(const key in headers){
        request.setRequestHeader(key,headers[key]);
    };
    request.onload=()=>{
        const {status}=request;
        if((200<=status)&&(status<=599)){
            const response=new Response(request.responseText,{
                status,
                statusText:request.statusText,
            });
            resolve(response);
        }
        else reject(new Error("unknown status code: "+status));
    }
    if(signal instanceof AbortSignal){
        signal.addEventListener("abort",()=>{
            request.abort();
        });
        request.onabort=()=>{
            const error=new Error("request aborted");
            error.name="AbortError";
            error.aborted=true;
            reject(error);
        }
    }
    request.onerror=()=>{
        reject(new Error("request error: network error or request blocked"));
    };
    if(timeout){
        request.timeout=timeout;
        request.ontimeout=()=>{
            const error=new Error("request timeout or network error");
            error.name="TimeoutError";
            error.timeout=true;
            reject(error);
        };
    }
    if(body instanceof FormData) request.send(body);
    else request.send(typeof(body)==="string"?body:JSON.stringify(body));
});
