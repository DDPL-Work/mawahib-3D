const fs = require('fs');
let content = fs.readFileSync('resume.jsx', 'utf8');

// Compact table
content = content.replace('min-width: 1000px;', 'min-width: ${embedded ? "100%" : "1000px"};');
content = content.replace('grid-template-columns: repeat(4, 1fr);', 'grid-template-columns: ${embedded ? "repeat(2, 1fr)" : "repeat(4, 1fr)"};');
content = content.replace('padding: 12px 16px;', 'padding: ${embedded ? "10px 12px" : "12px 16px"};');
content = content.replace('.cv-td { padding: 16px; }', '.cv-td { padding: ${embedded ? "12px 10px" : "16px"}; }');

// Hide Header if embedded
const headerStart = '<header className="cv-top">';
const headerReplacement = '{!embedded && (\\n            <header className="cv-top">';
const headerEnd = '</p>\\n          </header>';
const headerEndReplacement = '</p>\\n          </header>\\n          )}';

if (content.includes(headerStart)) {
  content = content.replace(headerStart, headerReplacement);
}
if (content.includes('<p className="cv-desc">Review submitted CVs, compare scores, and shortlist the right candidates.</p>\n          </header>')) {
   content = content.replace('<p className="cv-desc">Review submitted CVs, compare scores, and shortlist the right candidates.</p>\n          </header>', '<p className="cv-desc">Review submitted CVs, compare scores, and shortlist the right candidates.</p>\n            </header>\n          )}');
} else if (content.includes('<p className="cv-desc">Review submitted CVs, compare scores, and shortlist the right candidates.</p>\\r\\n          </header>')) {
   content = content.replace('<p className="cv-desc">Review submitted CVs, compare scores, and shortlist the right candidates.</p>\r\n          </header>', '<p className="cv-desc">Review submitted CVs, compare scores, and shortlist the right candidates.</p>\r\n            </header>\n          )}');
}

fs.writeFileSync('resume.jsx', content);
console.log('Replacements complete');
