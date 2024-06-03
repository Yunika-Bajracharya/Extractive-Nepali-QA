# Extractive Nepali Question Answering System

There is noticeable gap in language processing tools and resources for Nepali, a language spoken by millions yet significantly underrepresented in the field of computational linguistics. Understanding this gap, we have developed a web application and a browser extension that lets you ask questions in Nepali and get answers extracted from your documents or information on the web. Whether it’s students looking up facts for school or professionals searching for news and updates, our project aims to create easier access to information, thereby empowering Nepali speakers to thrive in the digital age.

### Here's our [Demo Video.](https://youtu.be/aHDpSnkGzfE?feature=shared)

### Methodology & Architecture
Recognizing the scarcity of dedicated Nepali datasets, the existing dataset is utilized by translating them to Nepali. Traditional translation methods often fail to maintain the integrity of answer spans, so we employ translation-invariant tokens to preserve answer spans across different languages, enhancing the fidelity of the translated data. To further boost the model's performance, we translate data into multiple Indo-Aryan languages, leveraging their similar linguistic structures. We study the quality of the dataset through qualitative analysis via human evaluation and quantitative assessment using LLM. 

We fine-tune MURIL to accurately predict the start and end tokens of answers given a passage and a question. Longer passages are segmented into blocks that fit the model’s context length. We then use the probability of tokens to compare and select the best answers from multiple blocks.

![website  about me](https://github.com/Yunika-Bajracharya/Extractive-Nepali-QA/assets/60802409/8f0ab843-8986-4010-88d9-0bb664ea1a71)

### Training Pipeline
![Screenshot 2024-06-03 234453](https://github.com/Yunika-Bajracharya/Extractive-Nepali-QA/assets/60802409/a66e7674-0a28-45c0-b3fa-e60c7ad4cfb8)

### Example Result
![prob](https://github.com/Yunika-Bajracharya/Extractive-Nepali-QA/assets/60802409/b341b4a2-15b4-458d-a45e-533e34328dec)

![eg](https://github.com/Yunika-Bajracharya/Extractive-Nepali-QA/assets/60802409/0c761a83-85d8-441f-9ea3-3aa649355228)
