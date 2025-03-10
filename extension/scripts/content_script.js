(() => {
    let highlightedEl = null
    chrome.runtime.onMessage.addListener(

        (obj, sender, res) => {
            const { type, textToHighlight } = obj;
            console.log(type, textToHighlight)

            news_body = document.getElementsByClassName("description current-news-block")
            node = searchDOMForString(news_body[0], textToHighlight)
            if (!node){
                node = searchDOMForString(document.body, textToHighlight)
            }

            if (node) {
                const success = highlightText(node, textToHighlight, "highlight")
                if (success) {
                    console.log(node)
                    node.scrollIntoView({ behavior: "smooth" , block: "center"});
                    // window.scroll({top: window.innerHeight / 2, behavior: "smooth"})
                    if (highlightedEl) {
                        clearHighlight(highlightedEl, "highlight");
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
    let walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    while (walker.nextNode()) {
        let node = walker.currentNode;
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

/**
 * Clears the highlighted elements with the specified style within the given element.
 *
 * @param {Element} element - The element containing the highlighted elements to be cleared.
 * @param {string} style - The CSS class style of the highlighted elements to be cleared.
 */
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