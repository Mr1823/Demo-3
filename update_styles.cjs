const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/pages/Dashboard/AdminAddProduct/AdminAddProduct.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Page Title
content = content.replace(
  /className="text-3xl font-bold font-serif mb-6"/g,
  'className="font-display-lg text-display-lg text-primary mb-8 tracking-tight"'
);

// 2. Section Headers
content = content.replace(
  /className="font-bold text-lg text-black border-b-2 p-4 mb-8"/g,
  'className="font-display-md text-headline-sm text-primary border-b border-[#c8a684]/30 pb-4 mb-8"'
);

// 3. Cards/Sections
content = content.replace(
  /className="shadow rounded-lg border pb-8"/g,
  'className="bg-surface-container-low/50 border border-[#c8a684]/30 p-6 md:p-8 hover:bg-white transition-all rounded-xl"'
);
content = content.replace(
  /className="shadow rounded-lg border pb-8 mt-8"/g,
  'className="bg-surface-container-low/50 border border-[#c8a684]/30 p-6 md:p-8 hover:bg-white transition-all rounded-xl mt-8"'
);

// 4. Inputs
content = content.replace(
  /className="text-xl border-0 outline-none border-b-2 border-gray-400 w-full mt-3 pb-2"/g,
  'className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 transition-all duration-300 outline-none focus:border-primary"'
);

// 5. Textareas
content = content.replace(
  /className="w-full border-2 border-gray-400 mt-3 p-4"/g,
  'className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 transition-all duration-300 outline-none focus:border-primary resize-none"'
);

// 6. Selects
content = content.replace(
  /className="border border-gray-300 w-full outline-none rounded py-3 px-2 category-container"/g,
  'className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 text-on-surface transition-all duration-300 outline-none focus:border-primary"'
);

// 7. Buttons
content = content.replace(
  /className="btn md:absolute md:-top-20 md:right-0 bg-black text-white font-bold border-0 rounded-none w-full md:w-\[180px\] hover:bg-\[var\(--pink-gold\)\] transition-all duration-300 ease-in-out"/g,
  'className="md:absolute md:-top-20 md:right-0 bg-primary text-white py-4 md:py-5 px-8 font-button-text uppercase tracking-[0.2em] text-[12px] hover:bg-primary-container transition-all duration-500 transform hover:scale-[1.01] active:scale-[0.98] w-full md:w-auto"'
);
content = content.replace(
  /className="btn absolute -top-20 right-0 bg-black text-white font-bold border-0 rounded-none md:w-\[180px\] hover:bg-\[var\(--pink-gold\)\] transition-all duration-300 ease-in-out"/g,
  'className="absolute -top-20 right-0 bg-primary text-white py-4 md:py-5 px-8 font-button-text uppercase tracking-[0.2em] text-[12px] hover:bg-primary-container transition-all duration-500 transform hover:scale-[1.01] active:scale-[0.98] w-full md:w-auto"'
);

// 8. Text colors
content = content.replace(/text-gray-600/g, 'text-outline font-label-caps tracking-[0.1em] text-xs uppercase');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated AdminAddProduct.jsx styles!");
