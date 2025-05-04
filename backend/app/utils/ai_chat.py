import openai, os
from dotenv import load_dotenv
load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def ask_culture_bot(context: str, question: str) -> str:
    prompt = (
        "You are a friendly representative of an indigenous culture. "
        "Use the context below to answer the user's question.\n\n"
        f"Context:\n{context}\n\nQuestion: {question}\nAnswer:"
    )
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=150,
        temperature=0.7,
    )
    return response.choices[0].text.strip()
