const fs = require('fs');

async function test() {
  const loginRes = await fetch('http://localhost:5249/api/Auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({Email: "bindu@gmail.com", Password: "bindu@123"})
  });
  const auth = await loginRes.json();

  const endpoints = [
    "/Products",
    "/Admin/stats",
    "/Orders/all",
    "/Admin/users"
  ];

  for (const ep of endpoints) {
    const res = await fetch('http://localhost:5249/api' + ep, {
      headers: { 'Authorization': 'Bearer ' + auth.token }
    });
    console.log(ep, res.status, await res.text());
  }
}

test();
