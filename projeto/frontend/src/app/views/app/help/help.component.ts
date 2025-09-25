import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

/**
 * Componente responsável pela página de ajuda e FAQ
 * Exibe perguntas frequentes diferenciadas por tipo de usuário
 * Contém instruções específicas para usuários comuns e administradores
 */
@Component({
  selector: 'app-help',
  imports: [MatIconModule, CommonModule],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})

export class HelpComponent {
  // Verifica se o usuário atual é administrador para exibir FAQs específicos
  isAdmin = (() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.userType === 'admin' || userData.user_type === 'admin';
    }
    return false;
  })();

  // Perguntas frequentes para usuários comuns (doadores e beneficiários)
  userFaqs = [
    {
      question: 'Como fazer uma doação?',
      answer: 'Acesse "Fazer Doação" no seu painel, cadastre os alimentos disponíveis e aguarde o contato de beneficiários.'
    },
    {
      question: 'Como solicitar doações?',
      answer: 'Use a opção "Solicitar Doação" para registrar suas necessidades. Lembre-se: apenas uma solicitação por mês.'
    }
  ];

  // Perguntas frequentes específicas para administradores
  adminFaqs = [
    {
      question: 'Como gerenciar usuários?',
      answer: 'Acesse "Gerenciar Usuários" no painel administrativo para verificar e aprovar beneficiários.'
    },
    {
      question: 'Como verificar estoque?',
      answer: 'Use as opções de "Verificar estoque" para visualizar gráficos de produtos básicos, higiene e infantis.'
    },
    {
      question: 'Como aprovar beneficiários?',
      answer: 'Na seção de gerenciamento, analise os documentos enviados e clique em "Confirmar" ou "Negar".'
    }
  ];
}
