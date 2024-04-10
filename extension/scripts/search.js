const fetch_url = "http://localhost:8000/scrape_search"
document.getElementById("searchButton").addEventListener("click", (e) => {
  e.preventDefault()
  let searchText = document.getElementById("searchBox").value
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
        textToHighlight = data.answer.answer

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
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
})


