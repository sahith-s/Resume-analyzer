from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import PyPDF2
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins="*", supports_credentials=False)

# Configure Gemini API
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY is missing. Please check your .env file.")

genai.configure(api_key=API_KEY)

def extract_text_from_pdf(pdf_file):
    """Extract text from a PDF file."""
    try:
        reader = PyPDF2.PdfReader(pdf_file)
        text = "\n".join(page.extract_text() or "" for page in reader.pages)
        return text.strip()
    except Exception as e:
        print(f"Error extracting PDF text: {e}")
        return ""

def analyze_resume(resume_text):
    """Send resume text to Gemini AI for analysis."""
    try:
        model = genai.GenerativeModel("gemini-1.5-flash") # model you are using
        prompt = (
            "Analyze the following resume and identify issues, missing sections, "
            "or areas of improvement. Provide feedback on formatting, clarity, "
            "keywords, and industry relevance. Also, suggest improvements. Generate a detailed score for each section in a tabular manner.\n\n"
            + resume_text
        )
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error analyzing resume: {e}")
        return f"Error analyzing resume: {str(e)}"

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/upload', methods=['POST'])
def upload_resume():
    """Handle PDF resume uploads and return analysis."""
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "File must be a PDF"}), 400
    
    try:
        resume_text = extract_text_from_pdf(file)
        if not resume_text:
            return jsonify({"error": "Could not extract text from PDF"}), 400
        
        analysis = analyze_resume(resume_text)
        return jsonify({"analysis": analysis})
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__': 
    print("Starting Flask server at http://127.0.0.1:5000")
    app.run(debug=True, host='0.0.0.0')
