import os
from google import genai

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def get_ai_response(question):

    prompt = f"""
You are a friendly AI voice assistant.

Answer the user's question clearly and briefly.

Rules:
• Keep the answer between 2 and 4 sentences.
• Use simple and easy-to-understand language.
• Use relevant emojis or special symbols where appropriate.
• Do not give unnecessary information.
• Do not give long explanations.
• Do not use markdown headings.
• Do not use numbered lists unless the question specifically requires steps.
• Make the response natural for speaking aloud.

User's question:
{question}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return response.text 