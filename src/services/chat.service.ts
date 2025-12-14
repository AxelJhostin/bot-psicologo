import { prisma } from '../lib/prisma';
import { WhatsAppService } from './whatsapp.service';

export class ChatService {
  
  static async processFlow(phone: string, input: string) {
    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({ data: { phone, step: 'START' } });
    }

    const cleanInput = input?.toLowerCase().trim();

    switch (user.step) {
      case 'START':
        await WhatsAppService.sendInteractiveButtons(phone, 
            "👋 ¡Hola! Soy el asistente de *MenteSana*. Estoy aquí para gestionar tus citas psicológicas. ¿Qué deseas hacer?", 
            [
                { id: 'agendar', title: '📅 Agendar Cita' },
                { id: 'mis_citas', title: '📂 Mis Citas' }
            ]
        );
        await this.updateStep(phone, 'MENU_PRINCIPAL');
        break;

      case 'MENU_PRINCIPAL':
        if (cleanInput === 'agendar') {
            await WhatsAppService.sendMessage(phone, "Perfecto. Por favor, escribe tu nombre completo para el registro.");
            await this.updateStep(phone, 'ESPERANDO_NOMBRE');
        } else if (cleanInput === 'mis_citas') {
            await WhatsAppService.sendMessage(phone, "Actualmente no tienes citas pendientes.");
            await this.updateStep(phone, 'START');
        } else {
            await WhatsAppService.sendMessage(phone, "⚠️ Opción no válida. Por favor escribe 'hola' para reiniciar.");
        }
        break;

      case 'ESPERANDO_NOMBRE':
        await prisma.user.update({ where: { phone }, data: { name: input } });
        await WhatsAppService.sendMessage(phone, `Gracias ${input}. Ahora, escribe la fecha y hora deseada (Ej: Lunes 15 de Octubre, 4pm).`);
        await this.updateStep(phone, 'ESPERANDO_FECHA');
        break;

      case 'ESPERANDO_FECHA':
        await prisma.cita.create({
            data: {
                fecha: input,
                userId: user.id
            }
        });
        
        await WhatsAppService.sendInteractiveButtons(phone, 
            `Confirmas tu cita para: *${input}*?`, 
            [
                { id: 'confirmar_si', title: '✅ Sí, confirmar' },
                { id: 'confirmar_no', title: '❌ Cancelar' }
            ]
        );
        await this.updateStep(phone, 'CONFIRMACION');
        break;

      case 'CONFIRMACION':
        if (cleanInput === 'confirmar_si') {
            await WhatsAppService.sendMessage(phone, "✅ ¡Listo! Tu cita ha sido agendada exitosamente. Te esperamos.");
        } else {
            await WhatsAppService.sendMessage(phone, "Entendido, hemos cancelado el proceso.");
        }
        await this.updateStep(phone, 'START');
        break;

      default:
        await this.updateStep(phone, 'START');
        await WhatsAppService.sendMessage(phone, "Escribe 'Hola' para comenzar.");
        break;
    }
  }

  private static async updateStep(phone: string, step: string) {
    await prisma.user.update({ where: { phone }, data: { step } });
  }
}