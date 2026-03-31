async function test() {
  try {
    const res = await fetch("http://localhost:5249/api/Products");
    const data = await res.json();
    if (data && data.length > 0) {
      const p = data[data.length - 1]; // get latest added product
      console.log("Latest Product Name:", p.NAME);
      if (p.image) {
        console.log("Image type:", typeof p.image);
        if (typeof p.image === "string") {
            console.log("Image starts with:");
            console.log(p.image.substring(0, 100));
        }
      } else {
        console.log("No image property.");
      }
    }
  } catch(e) {
    console.error(e);
  }
}
test();
