import json
import os


def read_json_file(file_path):
    with open(file_path, "r", encoding="utf-8") as json_file:
        data = json.load(json_file)
    return data


directory_path = "/eval/data"


combined_data_list = []


index_counter = 0


for filename in os.listdir(directory_path):
    if filename.endswith(".json"):
        file_path = os.path.join(directory_path, filename)
        data = read_json_file(file_path)
        for item in data["data"]:
            for qa in item["paragraphs"][0]["qas"]:
                combined_item = {
                    "id": index_counter,
                    "context": item["paragraphs"][0]["context"],
                    "question": qa["question"],
                    "answers": {
                        "text": [answer["text"] for answer in qa["answers"]],
                        "answer_start": [answer["answer_start"] for answer in qa["answers"]],
                    },
                }
                combined_data_list.append(combined_item)
                index_counter += 1


output_file_path = "eval/output.json"

combined_data_list = list(filter(lambda x: len(x["answers"]["text"]), combined_data_list))

with open(output_file_path, "w", encoding="utf-8") as json_file:
    output = {
        "data": combined_data_list
    }
    json.dump(output, json_file, ensure_ascii=False, indent=2)

print(f"Combined data saved to: {output_file_path}")

