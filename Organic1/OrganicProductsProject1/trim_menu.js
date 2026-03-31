const fs = require('fs');
const file = 'd:/FinalYearProject/OrganicProducts/src/Components/menu.jsx';
let text = fs.readFileSync(file, 'utf8');
const startIdx = text.indexOf("const hardcodedProducts = [");
const endIdx = text.indexOf("const [dbProducts, setDbProducts] = React.useState([]);");
if(startIdx > -1 && endIdx > -1) {
  text = text.substring(0, startIdx) + text.substring(endIdx);
  
  // also modify allProducts logic
  text = text.replace("const allProducts = [...hardcodedProducts, ...dbProducts];", "const allProducts = dbProducts;");
  
  fs.writeFileSync(file, text);
  console.log("Trimmed menu.jsx successfully");
} else {
  console.log("Could not find start or end index");
}
