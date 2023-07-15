mapping = {
    "`": "`",
    "'": "'",
    "\"": "\"",
    "(": ")",
    "[": "]",
    "{": "}",
    "<": ">",
    ":": ":"
}

function isEditableElement(el) {
    if (el instanceof HTMLElement && el.isContentEditable) return true;
    if (el instanceof HTMLInputElement) {
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types
        if (/text|email|number|password|search|tel|url/.test(el.type || '')) {
            return !(el.disabled || el.readOnly);
        }
    }
    if (el instanceof HTMLTextAreaElement) return !(el.disabled || el.readOnly);
    return false;
}

document.onkeydown = (event) => {
    if (event.key in mapping) {
        let selection = null
        if (typeof window.getSelection != "undefined") {
            selection = window.getSelection()
        } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
            selection = document.getSelection()
        }

        if (selection === null || !selection.getRangeAt || !selection.rangeCount) {
            console.log("No selection")
            return
        }

        if (selection.toString() === "") {
            console.log("Nothing selected")
            return
        }




        let range = window.getSelection().getRangeAt(0)
        if (!isEditableElement(range.startContainer.parentElement) || !isEditableElement(range.endContainer.parentElement)) return

        event.preventDefault()

        if (range.startContainer === range.endContainer) {
            let textContent = range.endContainer.textContent
            let start = range.startOffset;
            let end = range.endOffset;

            range.endContainer.textContent = textContent.slice(0, start) + event.key + textContent.slice(start, end) + mapping[event.key] + textContent.slice(end)
            range.setStart(range.startContainer, start + 1)
            range.setEnd(range.endContainer, end + 1)
            window.getSelection().addRange(range)
        } else {
            let startTextContent = range.startContainer.textContent
            let endTextContent = range.endContainer.textContent
            let start = range.startOffset;
            let end = range.endOffset;

            range.startContainer.textContent = startTextContent.slice(0, start) + event.key + startTextContent.slice(start)
            range.endContainer.textContent = endTextContent.slice(0, end) + mapping[event.key] + endTextContent.slice(end)
            range.setStart(range.startContainer, start + 1)
            range.setEnd(range.endContainer, end)
            window.getSelection().addRange(range)
        }

    }
}