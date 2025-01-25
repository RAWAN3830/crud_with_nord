from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)

@app.route('/compile', methods=['POST'])
def compile_latex():
    latex_code = request.json.get('latex_code')
    if not latex_code:
        return jsonify({'error': 'No LaTeX code provided'}), 400
    
    try:
        with open('temp.tex', 'w') as f:
            f.write(latex_code)
        
        result = subprocess.run(['pdflatex', '-interaction=nonstopmode', 'temp.tex'], capture_output=True, text=True)
        
        if result.returncode != 0:
            return jsonify({'error': 'LaTeX compilation failed', 'output': result.stderr}), 500
        
        with open('temp.pdf', 'rb') as f:
            pdf_data = f.read()
        
        # Clean up temporary files
        for ext in ['.aux', '.log', '.pdf', '.tex']:
            if os.path.exists(f'temp{ext}'):
                os.remove(f'temp{ext}')
        
        return pdf_data, 200, {'Content-Type': 'application/pdf'}
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)