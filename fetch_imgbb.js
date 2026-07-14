import https from 'https';

https.get('https://ibb.co/fRxhDRQ', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    const match = data.match(/<meta property="og:image" content="(.*?)"/);
    if(match) console.log("FOUND IMAGE URL:", match[1]);
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
