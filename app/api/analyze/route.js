const PAIR_REGEX = /^[A-Z]{3}\/[A-Z]{3}$/;

export async function POST(request) {
  try {
    const body = await request.json();
    const { pair } = body;

    if (!pair) {
      return Response.json(
        { success: false, error: 'pair is required' },
        { status: 400 }
      );
    }

    if (!PAIR_REGEX.test(pair)) {
      return Response.json(
        {
          success: false,
          error: 'Invalid pair format. Expected XXX/YYY (e.g. EUR/USD)'
        },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('Analyze API error: N8N_WEBHOOK_URL is not set');
      return Response.json(
        { success: false, error: 'Analysis failed. Please try again.' },
        { status: 500 }
      );
    }

    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pair })
    });

    if (!n8nResponse.ok) {
      throw new Error(`n8n responded with status ${n8nResponse.status}`);
    }

    const data = await n8nResponse.json();
    return Response.json(data);
  } catch (error) {
    console.error('Analyze API error:', error);
    return Response.json(
      { success: false, error: 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}
