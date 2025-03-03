import json
import csv

def create_highlighted_rows(data):
    rows = []
    
    for entry in data["data"]:
        for paragraph in entry["paragraphs"]:
            original_context = paragraph["context"]
            
            for qa in paragraph["qas"]:
                question = qa["question"]
                for answer in qa["answers"]:
                    answer_text = answer["text"]
                    answer_start = answer["answer_start"]

                    highlighted_context = (
                        original_context[:answer_start] + 
                        "**" + answer_text + "**" + 
                        original_context[answer_start + len(answer_text):]
                    )
                    print(highlighted_context)

                    rows.append([highlighted_context, question, answer_text])
    
    return rows


with open(r"xquad.en.json", "r", encoding="utf-8") as f:
    json_data = json.load(f)

rows = create_highlighted_rows(json_data)

with open("output-token.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Context", "Question", "Answer"])  
    writer.writerows(rows)

print("CSV file created successfully!")
