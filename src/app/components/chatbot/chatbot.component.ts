import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChatbotService } from '../../services/chatbot.service';

interface ChatMessage {
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent implements OnInit {
  isOpen = false;
  isTyping = false;
  messages: ChatMessage[] = [];
  userInput = '';
  
  quickSuggestions = [
    '¿Qué son los bonos corporativos?',
    '¿Cómo calculo la TCEA?',
    '¿Qué es el método francés?',
    '¿Cómo funciona la aplicación?'
  ];

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit() {
    // Mensaje de bienvenida
    this.addBotMessage('¡Hola! Soy JH, tu asistente virtual de ContaFácil. 🤖\n\nPuedo ayudarte con:\n• Preguntas sobre bonos corporativos\n• Cálculos financieros (TCEA, TREA)\n• Funcionamiento de la aplicación\n• Conceptos de finanzas\n\n¿En qué puedo ayudarte hoy?');
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      // Focus en el input cuando se abre
      setTimeout(() => {
        const input = document.querySelector('.chat-input') as HTMLInputElement;
        if (input) input.focus();
      }, 100);
    }
  }

  async sendMessage() {
    if (!this.userInput.trim()) return;

    const userMessage = this.userInput.trim();
    this.addUserMessage(userMessage);
    this.userInput = '';
    this.isTyping = true;

    try {
      const response = await this.chatbotService.getResponse(userMessage);
      this.isTyping = false;
      this.addBotMessage(response);
    } catch (error) {
      this.isTyping = false;
      this.addBotMessage('Lo siento, ocurrió un error. Por favor intenta de nuevo o contacta al soporte técnico.');
    }

    // Scroll al final del chat
    setTimeout(() => this.scrollToBottom(), 100);
  }

  private addUserMessage(content: string) {
    this.messages.push({
      content,
      type: 'user',
      timestamp: new Date()
    });
  }

  private addBotMessage(content: string) {
    this.messages.push({
      content,
      type: 'bot',
      timestamp: new Date()
    });
  }

  private scrollToBottom() {
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat() {
    this.messages = [];
    this.ngOnInit(); // Reagregar mensaje de bienvenida
  }

  trackByFn(index: number, item: ChatMessage): any {
    return index;
  }

  formatMessage(content: string): string {
    // Convertir saltos de línea a <br> y manejar texto simple
    return content.replace(/\n/g, '<br>');
  }

  selectSuggestion(suggestion: string) {
    this.userInput = suggestion;
    this.sendMessage();
  }
}
