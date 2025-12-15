import axios from 'axios';

export class WhatsAppService {
    // ⚠️ ELIMINAMOS la variable HEADERS de aquí arriba para evitar el error de lectura temprana

    static async sendMessage(to: string, text: string) {
        try {
            // ⚠️ CORRECCIÓN: Definimos la URL y los Headers DENTRO de la función
            // Así aseguramos que el TOKEN ya existe cuando se ejecuta
            const url = `https://graph.facebook.com/v17.0/${process.env.META_PHONE_ID}/messages`;
            
            const headers = {
                'Authorization': `Bearer ${process.env.META_API_TOKEN}`,
                'Content-Type': 'application/json'
            };

            await axios.post(url, {
                messaging_product: 'whatsapp',
                to: to,
                type: 'text',
                text: { body: text }
            }, { headers: headers });

            console.log(`✅ Mensaje enviado a ${to}: ${text}`);
        } catch (error: any) {
            // TRUCO: Usamos JSON.stringify(..., null, 2) para que nos muestre TODO el objeto bonito
            console.error('❌ ERROR FACEBOOK DETALLADO:', JSON.stringify(error.response?.data || error.message, null, 2));
        }
    }

    static async sendInteractiveButtons(to: string, bodyText: string, buttons: {id: string, title: string}[]) {
        try {
            const url = `https://graph.facebook.com/v17.0/${process.env.META_PHONE_ID}/messages`;
            
            const headers = {
                'Authorization': `Bearer ${process.env.META_API_TOKEN}`,
                'Content-Type': 'application/json'
            };

            const formattedButtons = buttons.map(b => ({
                type: "reply",
                reply: { id: b.id, title: b.title }
            }));

            await axios.post(url, {
                messaging_product: 'whatsapp',
                to: to,
                type: 'interactive',
                interactive: {
                    type: "button",
                    body: { text: bodyText },
                    action: { buttons: formattedButtons }
                }
            }, { headers: headers });

            console.log(`✅ Botones enviados a ${to}`);
        } catch (error: any) {
            // TRUCO: Usamos JSON.stringify(..., null, 2) para que nos muestre TODO el objeto bonito
            console.error('❌ ERROR FACEBOOK DETALLADO:', JSON.stringify(error.response?.data || error.message, null, 2));
        }
    }
}