import axios from 'axios';

export class WhatsAppService {
    private static BASE_URL = `https://graph.facebook.com/v17.0/${process.env.META_PHONE_ID}/messages`;
    private static HEADERS = {
        'Authorization': `Bearer ${process.env.META_API_TOKEN}`,
        'Content-Type': 'application/json'
    };

    static async sendMessage(to: string, text: string) {
        try {
            await axios.post(this.BASE_URL, {
                messaging_product: 'whatsapp',
                to: to,
                type: 'text',
                text: { body: text }
            }, { headers: this.HEADERS });
        } catch (error) {
            console.error('Error enviando mensaje:', error);
        }
    }

    static async sendInteractiveButtons(to: string, bodyText: string, buttons: {id: string, title: string}[]) {
        try {
            const formattedButtons = buttons.map(b => ({
                type: "reply",
                reply: { id: b.id, title: b.title }
            }));

            await axios.post(this.BASE_URL, {
                messaging_product: 'whatsapp',
                to: to,
                type: 'interactive',
                interactive: {
                    type: "button",
                    body: { text: bodyText },
                    action: { buttons: formattedButtons }
                }
            }, { headers: this.HEADERS });
        } catch (error) {
            console.error('Error enviando botones:', error);
        }
    }
}