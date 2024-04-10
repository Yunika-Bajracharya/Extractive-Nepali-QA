const fetch_url = "http://localhost:8000/scrape_search"

const textarea = document.getElementById("searchBox")
textarea.focus()
textarea.addEventListener('input', function() {
    this.rows = 1; // reset the number of rows
    this.rows = this.scrollHeight / this.style.lineHeight.replace('px','');
});

textarea.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        searchButton.click();
    }
});

document.getElementById("searchButton").addEventListener("click", (e) => {
  clearAnswerBlock()
  e.preventDefault()

  let searchTextBox = document.getElementById("searchBox")
  let searchText = searchTextBox.value
  searchTextBox.value = ""
  document.getElementById('loading').style.display = 'block'; // Show loading symbol
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    let url = tabs[0].url;
    const postData = {
      'url': url,
      'question': searchText
    }


    fetch(fetch_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the JSON from the response
      })
      .then(async data => {
        console.log('Success:', data);
        let textToHighlight = data.answer.answer
        addAnswerToBlock(textToHighlight)

        const tabs = await chrome.tabs.query({
          currentWindow: true,
          active: true
        });
        const tab = tabs[0]
        chrome.tabs.sendMessage(
          tab.id, message = {
            type: "searchResult",
            textToHighlight: textToHighlight
          }
        )
        document.getElementById('loading').style.display = 'none'; // Hide loading symbol
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
})


/**
 * Sets the provided answer to the element with id "answer".
 *
 * @param {string} answer - The answer to be added to the element.
 * @return {void} 
 */
function addAnswerToBlock(answer){
  let el = document.getElementById("answer")
  if (el){
    el.innerHTML = answer
  }
}
/**
 * Clears the answer block by removing its inner HTML content.
 *
 */
function clearAnswerBlock() {
  let el = document.getElementById("answer")
  if (el) {
    el.innerHTML = ""
  }
}