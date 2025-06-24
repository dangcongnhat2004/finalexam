const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // Parse URL and remove query string
    let parsedUrl = new URL(req.url, `http://localhost:8080`);
    let pathname = parsedUrl.pathname;

    // If pathname is just '/', serve index.html
    if (pathname === '/') {
        pathname = '/index.html';
    }

    // Build the file path
    let filePath = path.join(__dirname, pathname);

    // Get the file extension
    let ext = path.parse(filePath).ext;

    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found
            res.statusCode = 404;
            res.end(`File ${filePath} not found!`);
            return;
        }

        // Read the file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end(`Error getting the file: ${err}.`);
            } else {
                // Set the content type
                res.setHeader('Content-type', mimeTypes[ext] || 'text/plain');
                res.end(data);
            }
        });
    });
});

server.listen(port, () => {
    console.log(`Frontend server is running at http://localhost:8080`);
    console.log('You can now open your browser and navigate to the above URL');
});