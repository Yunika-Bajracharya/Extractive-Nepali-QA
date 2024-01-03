import pandas as pd
import os
import json
import argparse

version2 = False

def get_row(paragraph):
    context = paragraph['context']
    number_of_questions = len(paragraph['qas'])
    row = [context]
    for qa in paragraph['qas']:
        q = qa['question']
        row.append(q)
        answers = [ans['text'] for ans in qa['answers']]
        if qa.get('is_impossible', False):
            if qa.get('plausible_answers', False) and version2:
                answers = [ans['text'] for ans in qa['plausible_answers']]
        if len(answers) > 4:
            answers = answers[:4]

        row.extend(answers)
        if len(answers) < 4:
            row.extend([''] * (4 - len(answers)))

        if version2:
            row.append(1 if qa.get('is_impossible', False) else 0)

    return row, number_of_questions

def get_rows(paragraphs):
    rows = []
    max_number_of_questions = 0
    for paragraph in paragraphs:
        row, number_of_questions = get_row(paragraph)
        rows.append(row)
        max_number_of_questions = max(max_number_of_questions, number_of_questions)
    return rows, max_number_of_questions

def get_dataframe(paragraphs):
    rows, max_number_of_questions = get_rows(paragraphs)

    df = pd.DataFrame(rows)
    columns = ['Context']
    for i in range(max_number_of_questions):
        columns.append('Question/' + str(i))
        for j in range (4):
            columns.append('Answer/' + str(i) +  '/' + str(j))

        if version2:
            columns.append('Is Impossible/' + str(i))
    
    try:
        df.columns = columns
    except:
        print(len(df.iloc[0]))
        print(df.iloc[0])
        print(len(columns), len(df.columns))
        print(columns)
        raise Exception('Number of columns do not match')
    return df


def run(filepath):
    # filepath = "../Data/SQuAD2.0/dev-v2.0.json"
    output_path = os.path.join(os.getcwd(), 'untranslated')
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    with open(filepath, 'r') as file:
        json_data = json.load(file)
        data = json_data['data']

        for d in data:
            title = d['title']
            paragraphs = d['paragraphs']
            print("Processing " + title)
            df = get_dataframe(paragraphs)
            for p in paragraphs:
                row, number_of_questions = get_row(p)

            filename = title + ".xlsx"
            if not os.path.exists(os.path.join(output_path, filename)):
                df.to_excel(os.path.join(output_path, filename), index=False)
                print("Saved " + filename)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=str, required=True)
    args = parser.parse_args()
    run(args.input)
    