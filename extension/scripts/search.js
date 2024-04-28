const fetch_url = "http://localhost:8000/scrape_search";

let doTransliteration = false;
let input_content = "";
const transliterationButton = document.getElementById("transliterate");
// addAnswerToBlock(Sanscript.t("namaste", "hk", "devanagari"))

const textarea = document.getElementById("searchBox");
textarea.focus();
textarea.addEventListener("input", function (event) {
  console.log(event);

  if (doTransliteration) {
    event.preventDefault();
    if (event.inputType == "insertText") {
      input_content += event.data;
      let newText = Sanscript.t(input_content, "hk", "devanagari");
      textarea.value = newText;
    } else if (event.inputType == "deleteContentBackward") {
      input_content = input_content.slice(0, -1);
      let newText = Sanscript.t(input_content, "hk", "devanagari");
      textarea.value = newText;
    } else if (event.inputType == "insertFromPaste") {
      // NOt handled yet
    }
  }

  // Update block size
  this.rows = 1; // reset the number of rows
  this.rows = this.scrollHeight / this.style.lineHeight.replace("px", "");
});

textarea.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchButton.click();
  }
});

// Transliteration
transliterationButton.addEventListener("click", (e) => {
  // Just toggle between states
  if (doTransliteration) {
    transliterationButton.innerText = "ने";
  } else {
    transliterationButton.innerText = "Eng";
  }
  doTransliteration = !doTransliteration;
  textarea.value = "";
  input_content = "";
  textarea.focus();
});

document.getElementById("searchButton").addEventListener("click", (e) => {
  clearAnswerBlock();
  e.preventDefault();

  let searchTextBox = document.getElementById("searchBox");
  let searchText = searchTextBox.value;
  searchTextBox.value = "";
  document.getElementById("loading").style.display = "block"; // Show loading symbol
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    let url = tabs[0].url;
    const postData = {
      url: url,
      question: searchText,
    };

    fetch(fetch_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the JSON from the response
      })
      .then(async (data) => {
        console.log("Success:", data);
        let textToHighlight = data.answer.answer;
        addAnswerToBlock(textToHighlight);

        const tabs = await chrome.tabs.query({
          currentWindow: true,
          active: true,
        });
        const tab = tabs[0];
        chrome.tabs.sendMessage(
          tab.id,
          (message = {
            type: "searchResult",
            textToHighlight: textToHighlight,
          })
        );
        document.getElementById("loading").style.display = "none"; // Hide loading symbol
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});

/**
 * Sets the provided answer to the element with id "answer".
 *
 * @param {string} answer - The answer to be added to the element.
 * @return {void}
 */
function addAnswerToBlock(answer) {
  let el = document.getElementById("answer");
  if (el) {
    el.innerHTML = answer;
  }
  console.log(answer);
}
/**
 * Clears the answer block by removing its inner HTML content.
 *
 */
function clearAnswerBlock() {
  let el = document.getElementById("answer");
  if (el) {
    el.innerHTML = "";
  }
}
