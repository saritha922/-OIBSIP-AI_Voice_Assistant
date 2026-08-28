from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

# Load .env FIRST
load_dotenv()

from services.ai_response import get_ai_response

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()

    question = data.get("question", "").strip()

    if not question:
        return jsonify({"error": "Question is empty"}), 400

    try:
        answer = get_ai_response(question)
        return jsonify({"answer": answer})

    except Exception as e:
        print("AI Error:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)