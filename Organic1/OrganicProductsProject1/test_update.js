const fs = require('fs');

async function test() {
  const loginRes = await fetch('http://localhost:5249/api/Auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({Email: "bindu@gmail.com", Password: "bindu@123"})
  });
  const auth = await loginRes.json();
  
  const formData = new FormData();
  formData.append('Id', '1');
  formData.append('Name', 'Updated Product');
  formData.append('Price', '20.0');
  formData.append('Stock', '10');
  formData.append('Category', 'Spices & Masalas');
  
  const updateRes = await fetch('http://localhost:5249/api/Products/1', {
    method: 'PUT',
    headers: { 'Authorization': 'Bearer ' + auth.token },
    body: formData
  });
  console.log("Update Status:", updateRes.status);
  console.log("Body:", await updateRes.text());
}

test();
