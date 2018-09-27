/* eslint-disable no-console */
const http = require('http');
const fs = require('fs');

const responsePdf = (req, resp) => {
  const fileName = '../ios/test-pdf.pdf';
  fs.exists(fileName, (exists) => {
    if (exists) {
      fs.readFile(fileName, 'binary', (err, file) => {
        if (!err) {
          resp.writeHeader(200, {
            'Content-Type': 'application/pdf',
          });
          resp.write(file, 'binary');
          resp.end();
        } else {
          req.NotFound(req, resp);
        }
      });
    } else {
      req.NotFound(req, resp);
    }
  });
};

http.createServer((req, resp) => {
  console.log('method', req.method);
  console.log('headers', req.headers);

  const body = [];

  req.on('data', (data) => {
    body.push(data);
  });

  req.on('end', () => {
    console.log('body', body.join(''));
    responsePdf(req, resp);
  });
}).listen(8080);
