
function modifyResponseHeaderHandler_(details) {
    console.log(details.responseHeaders);
    return {
        responseHeaders: details.responseHeaders
    };
};


chrome.webRequest.onHeadersReceived.addListener(
    modifyResponseHeaderHandler_, 
    { urls: ["https://api.pwnedpasswords.com/range/*"]}, 
    ["responseHeaders", "blocking"]
);