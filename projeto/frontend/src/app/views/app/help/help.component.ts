import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-help',
  imports: [MatIconModule, CommonModule],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})

export class HelpComponent {
  isAdmin = localStorage.getItem('userType') === 'admin';

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
