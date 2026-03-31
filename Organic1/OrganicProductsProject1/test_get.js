const fs = require('fs');
async function test() {
  const req = await fetch('http://localhost:5249/api/Products');
  console.log(await req.text());
}
test();
