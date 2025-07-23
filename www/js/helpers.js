export async function fetchWithAuth(url,options= {}){
    const res = await fetch(url,{  
        ...options, // body headers vs..
        credentials : "include" // cookiler fetchle gönderilir
    });

    if(res.status === 401){
        const refreshRes = await fetch("/api/refresh-token",{
            method : "POST",
            credentials : "include"
        });
        if (!refreshRes.ok){
            window.location.href = "/login";
            return null;
        }
        return await fetch(url,{
            ...options,
            credentials : "include"
        })
    }
    return res
}