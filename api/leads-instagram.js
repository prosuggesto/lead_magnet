export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const response = await fetch('https://n8n.srv862127.hstgr.cloud/webhook/stock_leads_magnet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'leads.magnet': 'leads.magnet.01'
            },
            body: JSON.stringify(req.body || {})
        });

        // Handle response safely (webhook might not return JSON)
        let data;
        const text = await response.text();
        try {
            data = JSON.parse(text);
        } catch {
            data = { status: 'ok', raw: text };
        }

        res.status(200).json(data);
    } catch (err) {
        console.error('Webhook error:', err);
        res.status(500).json({ error: 'Webhook error', message: err.message });
    }
}
