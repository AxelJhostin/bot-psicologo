import { Request, Response } from 'express';
import { ChatService } from '../services/chat.service';

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN;

export class WebhookController {
  
  static verifyWebhook(req: Request, res: Response) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verificado correctamente');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }

  static async handleMessage(req: Request, res: Response) {
    try {
      const body = req.body;
      
      if (body.object === 'whatsapp_business_account') {
        const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
        
        if (message) {
            const from = message.from;
            const text = message.text?.body || message.interactive?.button_reply?.id;
            
            await ChatService.processFlow(from, text);
        }
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.error('Error en webhook:', error);
      res.sendStatus(500);
    }
  }
}