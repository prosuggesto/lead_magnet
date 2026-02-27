export default async function handler(req, res) {
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

        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Webhook error', message: err.message });
    }
}
