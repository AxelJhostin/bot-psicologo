import axios from 'axios';

export class WhatsAppService {
    // ⚠️ CAMBIO 1: Quitamos la variable estática HEADERS de aquí arriba para evitar el error de carga

    static async sendMessage(to: string, text: string) {
        try {
            // ⚠️ CAMBIO 2: Definimos la URL y los Headers DENTRO de la función
            // Actualicé la versión a v21.0 que es la más estable actual
            const url = `https://graph.facebook.com/v21.0/${process.env.META_PHONE_ID}/messages`;
            
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

            console.log(`✅ Mensaje enviado a ${to}`); // Log para confirmar éxito
        } catch (error: any) {
            // Log mejorado para ver qué dice Facebook si falla
            console.error('❌ Error enviando mensaje:', error.response?.data || error.message);
        }
    }

    static async sendInteractiveButtons(to: string, bodyText: string, buttons: {id: string, title: string}[]) {
        try {
            const url = `https://graph.facebook.com/v21.0/${process.env.META_PHONE_ID}/messages`;
            
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
            console.error('❌ Error enviando botones:', error.response?.data || error.message);
        }
    }
}