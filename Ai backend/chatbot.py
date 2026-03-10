import pandas as pd
import requests
from rapidfuzz import fuzz  


DATASET_PATH = r"C:\Users\HASSAN\Desktop\my-website\Ai backend\dataset.csv"


try:
    df = pd.read_csv(DATASET_PATH, encoding="utf-8", quotechar='"')
    df = df.apply(lambda x: x.str.strip() if x.dtype == "object" else x)
    print("Dataset loaded successfully! Rows:", len(df))
except Exception as e:
    print("Error loading dataset:", e)
    df = pd.DataFrame(columns=["Question_Roman", "Question_English", "Answer_Roman", "Answer_English"])


LM_STUDIO_URL = "http://127.0.0.1:1234"

SYSTEM_PROMPT = """
You are AidLink official support chatbot.
You speak politely, friendly and human-like.
If answer exists in dataset, use it.
Otherwise explain clearly in simple words.
"""

def search_dataset(user_question):
    user_question = user_question.lower().strip()

    best_match = None
    highest_score = 0

    for _, row in df.iterrows():
        
        score_r = fuzz.ratio(user_question, str(row["Question_Roman"]).lower())
        if score_r > highest_score:
            highest_score = score_r
            best_match = row
        
        score_e = fuzz.ratio(user_question, str(row["Question_English"]).lower())
        if score_e > highest_score:
            highest_score = score_e
            best_match = row

    if highest_score >= 75:  
        if fuzz.ratio(user_question, str(best_match["Question_Roman"]).lower()) >= 75:
            return best_match["Answer_Roman"]
        else:
            return best_match["Answer_English"]

    return None


def ask_llm(question):
    payload = {
        "model": "local-model",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": question}
        ],
        "temperature": 0.7
    }

    try:
        response = requests.post(LM_STUDIO_URL, json=payload)
        return response.json()["choices"][0]["message"]["content"]
    except:
        return "Sorry, I can only provide information about AidLink at the moment."


print("AidLink Chatbot Started")
print("Type 'exit' to stop\n")

while True:
    user_input = input("User: ")
    if user_input.lower() == "exit":
        print("Bot: Allah Hafiz")
        break

    answer = search_dataset(user_input)
    if answer:
        print("Bot:", answer)
    else:
        print("Bot:", ask_llm(user_input))
