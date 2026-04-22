export interface WebhookPayload {
  nombre: string;
  email: string;
  whatsapp: string;
  juegosSeleccionados: Array<{ nombre: string; tamañoGB: number }>;
  totalGB: number;
  requiereSD: boolean;
}

// Usamos una variable exclusiva para Magia para no entrar en conflicto con el chat.
const WEBHOOK_URL = import.meta.env.VITE_N8N_MAGIA_WEBHOOK_URL || 'https://n8n.electrorepara.cl/webhook/magia-checkout';

export async function sendWebhookData(payload: WebhookPayload): Promise<boolean> {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status} ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error enviando datos al webhook:', error);
    return false;
  }
}
