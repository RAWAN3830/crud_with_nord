import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:io';
import 'package:path_provider/path_provider.dart';

class PdfGenerator {
  Future<String> compileLatex(String latexCode) async {
    final response = await http.post(
      Uri.parse('http://your-backend-url/compile'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'latex_code': latexCode}),
    );

    if (response.statusCode == 200) {
      final outputDir = await getApplicationDocumentsDirectory();
      final outputFile = File('${outputDir.path}/compiled_cv.pdf');
      await outputFile.writeAsBytes(response.bodyBytes);
      return outputFile.path;
    } else {
      throw Exception('Failed to compile LaTeX: ${response.statusCode}');
    }
  }

  Future<void> printPdf(String pdfPath) async {
    final file = File(pdfPath);
    final bytes = await file.readAsBytes();
    await Printing.sharePdf(bytes: bytes, filename: 'compiled_cv.pdf');
  }
}

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PDF Generator',
      home: PdfHomePage(),
    );
  }
}

class PdfHomePage extends StatelessWidget {
  final PdfGenerator pdfGenerator = PdfGenerator();

  String sampleLatex = r"""
\documentclass{article}
\usepackage[utf8]{inputenc}

\title{My Resume}
\author{Darshan Savaliya}
\date{August 2023}

\begin{document}

\maketitle

\section*{Contact Information}
Ahmedabad \\
savaliyadarshan95@gmail.com | 8200190723 \\
LinkedIn: https://linkedin.com/in/savaliya-darshan \\
GitHub: https://github.com/Darshan6069

\section*{Summary}
Motivated and detail-oriented Flutter and Android developer...

\section*{Education}
Gujarat University - Bachelor of Computer Application \\
SGPA: 6.6/10.0 \\
June 2021 – Apr 2024

\section*{Projects}
\begin{itemize}
    \item SwiftBuy - E-commerce app with Firebase integration...
    \item Bhagavad Gita App - Intuitive app with local storage...
    \item Weather App - Real-time weather updates using OpenWeather API...
\end{itemize}

\section*{Technologies}
Languages: Dart, HTML, CSS, Java, C++, C \\
Frameworks/Libraries: Flutter \\
Databases: SQLite, MySQL \\
Additional Tools: Git, Firebase, Figma

\end{document}
""";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('PDF Generator'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () async {
                try {
                  final pdfPath = await pdfGenerator.compileLatex(sampleLatex);
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => PdfPreviewPage(pdfPath: pdfPath),
                    ),
                  );
                } catch (e) {
                  print("Error compiling LaTeX: $e");
                }
              },
              child: Text('Generate & View PDF'),
            ),
            ElevatedButton(
              onPressed: () async {
                try {
                  final pdfPath = await pdfGenerator.compileLatex(sampleLatex);
                  await pdfGenerator.printPdf(pdfPath);
                } catch (e) {
                  print("Error compiling and sharing PDF: $e");
                }
              },
              child: Text('Share PDF'),
            ),
          ],
        ),
      ),
    );
  }
}

class PdfPreviewPage extends StatelessWidget {
  final String pdfPath;

  PdfPreviewPage({required this.pdfPath});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('PDF Preview'),
      ),
      body: PdfPreview(
        build: (format) => File(pdfPath).readAsBytes(),
      ),
    );
  }
}