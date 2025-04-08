const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// Proxy middleware for API requests
app.use('/api', (req, res) => {
    // Create a copy of the headers and remove the host header
    const headers = { ...req.headers };
    delete headers.host;
    
    const options = {
        hostname: '127.0.0.1', // Use IPv4 loopback address instead of 'localhost'
        port: 5000,
        path: `/api${req.url}`, // Ensure the path includes /api prefix
        method: req.method,
        headers: headers
    };

    console.log(`Proxying ${req.method} request to ${options.hostname}:${options.port}${options.path}`);
    
    const proxyReq = require('http').request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    proxyReq.on('error', (e) => {
        console.error('Proxy error:', e);
        res.status(500).send(`Backend connection error: ${e.message}`);
    });

    // Handle request body for POST, PUT, PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    }
    
    proxyReq.end();
});

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname)));

// Route all requests to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Frontend server running on http://localhost:${PORT}`);
});
