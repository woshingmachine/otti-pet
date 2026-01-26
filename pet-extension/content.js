if (!document.getElementById("typing-otter")) {
    const otter = document.createElement("img");
    otter.src = chrome.runtime.getURL("otter.png");
    otter.id = "typing-otter";
    document.body.appendChild(otter);
}