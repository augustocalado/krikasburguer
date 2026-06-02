import { Controller, Post, Body, Logger } from '@nestjs/common';
import { EvolutionService } from './evolution.service';

@Controller('webhooks/evolution')
export class EvolutionWebhookController {
  private readonly logger = new Logger(EvolutionWebhookController.name);

  constructor(private readonly evolutionService: EvolutionService) {}

  @Post()
  async handleWebhook(@Body() data: any) {
    this.logger.log(`Received webhook from Evolution API: ${data.event}`);

    switch (data.event) {
      case 'MESSAGES_UPSERT':
        await this.handleIncomingMessage(data);
        break;
      case 'CONNECTION_UPDATE':
        await this.handleConnectionUpdate(data);
        break;
      default:
        this.logger.debug(`Unhandled event: ${data.event}`);
    }

    return { status: 'success' };
  }

  private async handleIncomingMessage(data: any) {
    const message = data.data;
    const remoteJid = message.key.remoteJid;
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text;

    if (text) {
      this.logger.log(`New message from ${remoteJid}: ${text}`);
      // Here you would integrate with your Chatbot or Human service
    }
  }

  private async handleConnectionUpdate(data: any) {
    const status = data.data.status;
    this.logger.log(`Connection update: ${status}`);
    // Update instance status in database
  }
}
