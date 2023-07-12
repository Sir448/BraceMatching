chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        "`": 1,
        "'": 1,
        "\"": 1,
        "(": 1,
        "[": 1,
        "{": 1,
        "<": 1,
        ":": 0
    }).then(() => {
        console.log("Value is set");
    });
})