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
  get isAdmin(): boolean {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      return user.userType === 'admin';
    }
    return false;
  }



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
      question: 'Como gerenciar usuários do sistema?',
      answer: 'Acesse "Gerenciar Usuários" no painel administrativo. Você pode visualizar todos os usuários cadastrados, verificar status de aprovação, bloquear/desbloquear contas e analisar documentos enviados pelos beneficiários.'
    },
    {
      question: 'Como aprovar ou negar beneficiários?',
      answer: 'Na seção "Gerenciar Usuários", clique no usuário pendente, analise os documentos (RG, CPF, comprovante de renda), verifique se atende aos critérios de vulnerabilidade social e clique em "Aprovar" ou "Negar" com justificativa.'
    },
    {
      question: 'Como monitorar o estoque de alimentos?',
      answer: 'Use "Verificar Estoque" para visualizar gráficos em tempo real de produtos básicos, higiene e infantis. Monitore níveis críticos, produtos próximos ao vencimento e histórico de movimentação.'
    },
    {
      question: 'Como gerenciar doações e solicitações?',
      answer: 'No painel administrativo, monitore todas as doações ativas, solicitações pendentes, aprove/rejeite itens inadequados e acompanhe o matching entre doadores e beneficiários.'
    },
    {
      question: 'Como gerar relatórios do sistema?',
      answer: 'Acesse "Relatórios" para gerar dados sobre: usuários ativos, doações realizadas, estoque atual, beneficiários atendidos e estatísticas mensais. Exporte em PDF ou Excel.'
    },
    {
      question: 'Como configurar categorias de alimentos?',
      answer: 'Em "Configurações", gerencie as categorias (Básicos, Higiene, Infantis), adicione novos tipos de produtos, defina critérios de validade e configure alertas de estoque baixo.'
    },
    {
      question: 'Como moderar conteúdo inadequado?',
      answer: 'Monitore descrições de doações, remova conteúdo impróprio, bloqueie usuários que violem as políticas e mantenha a qualidade das informações no sistema.'
    },
    {
      question: 'Como acompanhar atividades do sistema?',
      answer: 'Use o "Log de Atividades" para monitorar ações dos usuários, detectar comportamentos suspeitos, rastrear alterações importantes e manter auditoria completa do sistema.'
    },
    {
      question: 'Como gerenciar doações pendentes?',
      answer: 'Acesse "Gerenciar Doações" para visualizar todas as doações aguardando aprovação, verificar detalhes dos produtos, datas de validade e confirmar ou rejeitar doações conforme critérios de qualidade e segurança alimentar.'
    }
  ];
}
