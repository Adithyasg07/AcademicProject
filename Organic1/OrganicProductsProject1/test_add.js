const fs = require('fs');

async function test() {
  const loginRes = await fetch('http://localhost:5249/api/Auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({Email: "bindu@gmail.com", Password: "bindu@123"})
  });
  const auth = await loginRes.json();
  if(!auth.token) {
    console.log("Login failed", auth);
    return;
  }
  
  const formData = new FormData();
  formData.append('Name', 'Test Product');
  formData.append('Price', '10.5');
  formData.append('Stock', '5');
  formData.append('Category', 'Combo & Deals');
  
  const addRes = await fetch('http://localhost:5249/api/Products', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + auth.token },
    body: formData
  });
  const text = await addRes.text();
  console.log("Status:", addRes.status);
  console.log("Body:", text);
}

test();
