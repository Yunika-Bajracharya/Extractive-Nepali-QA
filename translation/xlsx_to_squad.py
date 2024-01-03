import os
import json
import pandas as pd
import csv
import argparse
import pickle

def list_files(directory):
    return [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]

version2 = False

found_answers = []
not_found_answers = []

def df_to_paragraphs(df):
    paragraphs = []
    q_count = 0
    success_count = 0
    failed_count = 0
    for i, row in df.iterrows():
        context = row.iloc[0]

        qas = []

        step_size = 6 if version2 else 5
        for j in range(1, len(row), step_size):

            question = row.iloc[j]
            question = str(question)

            if question == 'nan' or question == '':
                continue

            answers_text = []
            answers_start = []
            for k in range(4):
                try:
                    answer = str(row.iloc[j+k+1])
                    answer = answer.strip()
                except:
                    for  l, (col_name, col_data) in enumerate(row.items()):
                        print(f"{l} {col_name}: {col_data}")
                    print(j, k)
                    print(len(row))

                    raise Exception('Error')
                start = context.find(answer)
                if answer == 'nan' or start == -1 or answer == '':
                    continue
                
                # answers.append({
                #     'text': answer,
                #     'answer_start': start
                # })
                answers_text.append(answer)
                answers_start.append(start)

            

            if len(answers_text) == 0:
                failed_count += 1
                # not_found_answers.append(row.iloc[j+1:j+5])
                not_found_answers.append(str(row.iloc[j+1]))
                continue
                
            found_answers.append(answers_text[0])
            answers = {
                'text': answers_text,
                'answer_start': answers_start
            }

            if version2:
                qas.append({
                    'id': q_count,
                    'question': question,
                    'answers': answers,
                    'is_impossible': row.iloc[j+5] == 1
                })
            else:
                qas.append({
                    'id': q_count,
                    'question': question,
                    'answers': answers
                })
            q_count += 1
            success_count += 1
            
        paragraphs.append({
            'context': context,
            'qas': qas
        })
    return paragraphs, success_count, failed_count

def flatten_paragraphs(paragraphs, filename, for_csv: bool = True):
    rows = []
    for p in paragraphs:
        context = p['context']
        for q in p['qas']:
            id = q['id']
            if for_csv:
                row = {
                    'id': id,
                    'filename': filename,
                    'context': context,
                    'question': q['question'],
                    # 'answer': q['answers'][0]['text'],
                    # 'start': q['answers'][0]['answer_start']
                    'answer': q['answers']['text'][0],
                    'start': q['answers']['answer_start'][0]

                }
            else:
                row = {
                    'id': id,
                    'filename': filename,
                    'context': context,
                    'question': q['question'],
                    'answers': q['answers']
                }
            rows.append(row)
    return rows

def run_squad(input_folder_path, output_path):
    output = {
        "data": []
    }
    # input_folder_path = '/home/suban/Documents/Major/code/untranslated'
    files = list_files(input_folder_path)

    success_count = 0
    failed_count = 0
    for f in files:
        print(f"Processing {f}", end=" ")

        df = pd.read_excel(os.path.join(input_folder_path, f))
        filename, _ = os.path.splitext(f)

        paragraphs, success, failed = df_to_paragraphs(df)
        success_count += success
        failed_count += failed

        output['data'].append({
            'title': filename,
            'paragraphs': paragraphs
        })

        print(f"Success: {success} Failed: {failed}")
    print(f"Success: {success_count}")
    print(f"Failed: {failed_count}")
    with open(output_path, 'w') as f:
        json.dump(output, f)

def run_rows(input_folder_path, output_path, for_csv: bool = True):
    files = list_files(input_folder_path)

    success_count = 0
    failed_count = 0
    rows = []
    for f in files:
        print(f"Processing {f}", end=" ")

        df = pd.read_excel(os.path.join(input_folder_path, f))
        filename, _ = os.path.splitext(f)

        paragraphs, success, failed = df_to_paragraphs(df)
        success_count += success
        failed_count += failed

        file_rows = flatten_paragraphs(paragraphs, filename, for_csv=for_csv)
        rows.extend(file_rows)

        print(f"Success: {success} Failed: {failed}")

    if for_csv:
        with open(output_path.replace('.json', '.csv'), 'w' , encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=['id', 'filename', 'context', 'question', 'answer', 'start'])
            writer.writeheader()
            writer.writerows(rows)
    else:
        with open(output_path, 'w', encoding='utf8') as f:
            json.dump({'data': rows}, f)

    print(f"Success: {success_count}")
    print(f"Failed: {failed_count}")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Convert SQuAD to XLSX')
    parser.add_argument('--input', type=str, help='Input folder path', required=True)
    parser.add_argument('--output', type=str, help='Output file path', default='squad.json')
    parser.add_argument('--outputType', type=str, help='Structure of output file', default='rows')
    args = parser.parse_args()

    if args.outputType == 'squad':
        run_squad(args.input, args.output)
    else:
        run_rows(args.input, args.output, for_csv=False)
    
    print("Found answers avg length:", end=" ")
    print(sum(list(map(lambda x: len(x), found_answers))) / len(found_answers))

    print("Not found answers avg length:", end=" ")
    print(sum(list(map(lambda x: len(x), not_found_answers))) / len(not_found_answers))

    with open('data.pickle', 'wb') as f:
        pickle.dump({'found': found_answers, 'not_found': not_found_answers}, f)