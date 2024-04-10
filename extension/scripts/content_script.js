(() => {
    let highlightedEl = null
    chrome.runtime.onMessage.addListener(

        (obj, sender, res) => {
            const { type, textToHighlight } = obj;
            console.log(type, textToHighlight)
            node = searchDOMForString(document.body, textToHighlight)
            if (node) {
                const success = highlightText(node, textToHighlight, "highlight")
                console.log(success)
                if (success) {
                    node.scrollIntoView({ behavior: "smooth" });
                    if (highlightedEl) {
                        // clear highlight
                        clearHighlight(node, "highlight");
                    }
                    highlightedEl = node

                }

            }
            else{
                console.log("Could not find element")
            }
        }
    )
})();




/**
 * Searches the DOM starting from the root element for a specific string.
 *
 * @param {Node} root - The root element to start the search from
 * @param {string} searchString - The string to search for within the DOM
 * @return {Node|null} The parent node that contains the searched string, or null if not found
 */
function searchDOMForString(root, searchString) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    while (walker.nextNode()) {
        var node = walker.currentNode;
        if (node.textContent.includes(searchString)) {
            return node.parentNode
        }
    }
    return null;
}

/**
 * Highlights a specific text within an element by applying a given style.
 *
 * @param {HTMLElement} element - The HTML element where the text will be highlighted
 * @param {string} textToHighlight - The text to be highlighted within the element
 * @param {string} style - The CSS style (class) to be applied to the highlighted text
 */
function highlightText(element, textToHighlight, style) {
    const innerHTML = element.innerHTML;
    const index = innerHTML.indexOf(textToHighlight);
    if (index >= 0) {
        element.innerHTML = innerHTML.substring(0, index) + "<span class='" + style + "'>" + innerHTML.substring(index, index + textToHighlight.length) + "</span>" + innerHTML.substring(index + textToHighlight.length);
        return true
    }
    else {
        return false
    }
}

function clearHighlight(element, style) {
    const highlightedElements = element.querySelectorAll(`span.${style}`);
    highlightedElements.forEach(highlightedElement => {
        const parent = highlightedElement.parentNode;
        while (highlightedElement.firstChild) {
            parent.insertBefore(highlightedElement.firstChild, highlightedElement);
        }
        parent.removeChild(highlightedElement);
    });
}