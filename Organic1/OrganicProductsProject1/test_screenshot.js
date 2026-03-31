const fs = require('fs');

async function test() {
  const loginRes = await fetch('http://localhost:5249/api/Auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({Email: "bindu@gmail.com", Password: "bindu@123"})
  });
  const auth = await loginRes.json();

  const formData = new FormData();
  formData.append('Name', 'Abc');
  formData.append('Price', '12');
  formData.append('Stock', '10');
  formData.append('Category', 'Combos & Deals');
  
  // mock an image buffer
  const buffer = Buffer.alloc(1024, 0); 
  const blob = new Blob([buffer], { type: 'image/jpeg' });
  formData.append('imageFile', blob, 'Chasing Glory.jpg');

  const res = await fetch('http://localhost:5249/api/Products', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + auth.token },
    body: formData
  });
  
  console.log(res.status, await res.text());
}

test();
