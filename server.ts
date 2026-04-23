import express from 'express';
import { createServer as createViteServer } from 'vite';
import crypto from 'crypto';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(express.json());

// Load credentials provided by the user (or from runtime secrets mapped to env vars)
const DIGIFLAZZ_USERNAME = process.env.DIGIFLAZZ_USERNAME || 'sixugagxO7NW';
// By default we use the Development Key for safety. Later admin can switch this.
const DIGIFLAZZ_KEY = process.env.DIGIFLAZZ_KEY || 'dev-06f69930-333b-11f1-9a87-7d331f9ce701';

// Helper to generate Digiflazz MD5 Signature
function generateSign(cmd: string | number) {
    return crypto.createHash('md5').update(DIGIFLAZZ_USERNAME + DIGIFLAZZ_KEY + cmd).digest('hex');
}

// 1. Cek Cek Saldo
app.post('/api/digiflazz/cek-saldo', async (req, res) => {
    try {
        const response = await fetch('https://api.digiflazz.com/v1/cek-saldo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cmd: 'deposit',
                username: DIGIFLAZZ_USERNAME,
                sign: generateSign('depo')
            })
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// 2. Daftar Harga (Pricelist)
app.post('/api/digiflazz/price-list', async (req, res) => {
    try {
        const response = await fetch('https://api.digiflazz.com/v1/price-list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cmd: 'prepaid',
                username: DIGIFLAZZ_USERNAME,
                sign: generateSign('pricelist')
            })
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// 3. Melakukan Transaksi Top-Up
app.post('/api/digiflazz/transaction', async (req, res) => {
    const { buyer_sku_code, customer_no, ref_id } = req.body;
    
    if (!buyer_sku_code || !customer_no || !ref_id) {
        return res.status(400).json({ error: "Missing required fields (buyer_sku_code, customer_no, ref_id)" });
    }

    try {
        // Untuk transaksi, 'sign' menggunakan format: username + key + ref_id
        const sign = generateSign(ref_id);

        const response = await fetch('https://api.digiflazz.com/v1/transaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: DIGIFLAZZ_USERNAME,
                buyer_sku_code,
                customer_no,
                ref_id,
                sign,
                testing: DIGIFLAZZ_KEY.startsWith('dev-') ? true : false // Otomatis mode testing jika pakai development key
            })
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Inisiasi Server dengan Vite Middleware
async function startServer() {
    if (process.env.NODE_ENV !== "production") {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: "spa",
        });
        app.use(vite.middlewares);
    } else {
        const distPath = path.join(process.cwd(), 'dist');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    }

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Backend Server API siap berjalan pada http://localhost:${PORT}`);
    });
}

startServer();
