To run the project, you need to follow a few steps. This includes setting up your backend service and integrating it with your Flutter app. Here's a detailed guide on how to do that:

### Step 1: Setting Up the Backend Service

#### Prerequisites
- Install Python (if not already installed).
- Install Flask (`pip install flask`).
- Install `pdflatex` or any other LaTeX compiler.

#### Create the Backend Service
1. **Create a new directory for your backend service**:
    ```sh
    mkdir latex_backend
    cd latex_backend
    ```

2. **Create a `main.py` file** in this directory and add the following code:
    ```python
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
    ```

3. **Run the backend service**:
    ```sh
    python main.py
    ```
    By default, Flask will start the server on `http://127.0.0.1:5000`.

### Step 2: Setting Up the Flutter App

#### Prerequisites
- Install Flutter SDK.
- Set up an editor like VSCode or Android Studio.
- Ensure you have the necessary dependencies installed (`flutter pub get`).

#### Update Your Flutter Code
1. **Add Dependencies**:
   Add the `http` package to your `pubspec.yaml`:
    ```yaml
    dependencies:
      flutter:
        sdk: flutter
      http: ^0.13.3
      path_provider: ^2.0.11
      printing: ^5.6.1
    ```

2. **Update the `PdfGenerator` class**:
    Replace your existing `PdfGenerator` class with the one provided earlier.

3. **Update the `PdfPreviewPage` class**:
    Make sure it uses the PDF preview library correctly. You might need to adjust the imports based on your setup.

4. **Run the Flutter App**:
    Open your terminal and navigate to your Flutter project directory. Run the following command:
    ```sh
    flutter run
    ```

### Step 3: Integrating the Backend and Frontend

1. **Ensure the backend is running**:
    Keep the backend service running (`python main.py`) and note the URL where it's hosted (e.g., `http://127.0.0.1:5000/compile`).

2. **Update the Flutter app to point to the backend URL**:
    In the `PdfGenerator` class, replace `'http://your-backend-url/compile'` with the actual URL of your backend service.

    For example:
    ```dart
    final response = await http.post(
      Uri.parse('http://127.0.0.1:5000/compile'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'latex_code': latexCode}),
    );
    ```

### Step 4: Testing the Integration

1. **Generate and View PDF**:
    When you press the "Generate & View PDF" button in your Flutter app, it should send the LaTeX code to the backend, compile it into a PDF, and display the PDF within the app.

2. **Share PDF**:
    Similarly, when you press the "Share PDF" button, it should generate the PDF and share it using the available options on your device.

### Troubleshooting Tips

- **Backend Errors**: If the backend fails to compile the LaTeX code, check the error messages returned by the backend and ensure that all necessary LaTeX packages are installed.
- **Network Issues**: Ensure that the backend URL is accessible from the Flutter app. If testing on a physical device, make sure the backend is reachable over the network.
- **Dependencies**: Ensure all dependencies are correctly installed and imported in both the backend and frontend projects.

By following these steps, you should be able to successfully run your project and generate PDFs from LaTeX code within your Flutter app.
