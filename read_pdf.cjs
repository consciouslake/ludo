const fs = require('fs');
const pdfParse = require('pdf-parse');

const pdf = typeof pdfParse === 'function' ? pdfParse : (pdfParse.default || pdfParse);

let dataBuffer = fs.readFileSync('Agency_Leader_Program_-_FY26_Club_updated (1).pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('parsed_pdf.txt', data.text);
    console.log("PDF parsed successfully.");
}).catch(err => {
    console.error("Error parsing PDF:", err);
});
