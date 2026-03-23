import sys
try:
    import fitz  # PyMuPDF
except ImportError:
    print("PyMuPDF not installed.")
    sys.exit(1)

text = ""
with fitz.open('Agency_Leader_Program_-_FY26_Club_updated (1).pdf') as doc:
    for page in doc:
        text += page.get_text()

with open('parsed_pdf.txt', 'w', encoding='utf-8') as f:
    f.write(text)
print("PDF parsed successfully.")
