import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EvolutionService {
  private readonly logger = new Logger(EvolutionService.name);
  private readonly axiosInstance: AxiosInstance;

  constructor(private configService: ConfigService) {
    const baseUrl = this.configService.get<string>('EVOLUTION_API_URL');
    const apiKey = this.configService.get<string>('EVOLUTION_API_KEY');

    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        apikey: apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  async createInstance(instanceName: string) {
    try {
      const response = await this.axiosInstance.post('/instance/create', {
        instanceName,
        token: this.generateRandomToken(),
        number: '',
        qrcode: true,
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Error creating instance: ${error.message}`);
      throw error;
    }
  }

  async getQrCode(instanceName: string) {
    try {
      const response = await this.axiosInstance.get(`/instance/connect/${instanceName}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error getting QR code: ${error.message}`);
      throw error;
    }
  }

  async sendText(instanceName: string, number: string, text: string) {
    try {
      const response = await this.axiosInstance.post(`/message/sendText/${instanceName}`, {
        number,
        options: {
          delay: 1200,
          presence: 'composing',
          linkPreview: false,
        },
        textMessage: {
          text,
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Error sending text message: ${error.message}`);
      throw error;
    }
  }

  private generateRandomToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}
