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

  get isDonor(): boolean {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      return user.userType === 'donor';
    }
    return false;
  }

  get currentFaqs() {
    if (this.isAdmin) {
      return this.adminFaqs;
    } else if (this.isDonor) {
      return this.donorFaqs;
    } else {
      return this.userFaqs;
    }
  }





  donorFaqs = [
    {
      question: 'Como registrar uma doação de alimentos?',
      answer: 'Acesse "Fazer Ação", selecione o tipo de produto (Básicos, Higiene ou Infantis), escolha o produto específico, informe a quantidade, número de unidades e data de validade. Sua doação ficará pendente até aprovação do administrador.'
    },
    {
      question: 'Quais produtos posso doar?',
      answer: 'Você pode doar produtos básicos (arroz, feijão, óleo, açúcar, etc.), produtos de higiene (sabonete, pasta de dente, shampoo, etc.) e produtos infantis (bolacha, gelatina, brinquedos). Cada produto tem opções específicas de quantidade.'
    },
    {
      question: 'Como funciona a validação de datas de validade?',
      answer: 'O sistema valida automaticamente se a data de validade é posterior à data atual. Produtos com validade próxima ao vencimento podem ser rejeitados. Brinquedos não precisam de data de validade.'
    },
    {
      question: 'Como acompanhar minhas doações?',
      answer: 'Use "Acompanhar Ações" para ver todas suas doações com status: Pendente (aguardando aprovação), Estocado (aprovado e disponível) ou Utilizado (já distribuído). Você pode ver detalhes como produto, quantidade e data.'
    },
    {
      question: 'Como gerar relatórios de impacto das minhas doações?',
      answer: 'Acesse "Gerar Relatório" para visualizar estatísticas completas: total de doações realizadas, média semanal de doações e estimativa de pessoas ajudadas com suas contribuições.'
    },
    {
      question: 'O que acontece após registrar uma doação?',
      answer: 'Sua doação fica com status "Pendente" até um administrador analisar e aprovar. Após aprovação, os produtos são adicionados ao estoque e ficam disponíveis para distribuição aos beneficiários.'
    },
    {
      question: 'Como funciona o sistema de unidades e quantidades?',
      answer: 'Para produtos com peso (kg, g) ou volume (l, ml), informe a quantidade por unidade e o número de unidades. Para produtos unitários, informe apenas a quantidade total. O sistema calcula automaticamente o peso/volume total.'
    },
    {
      question: 'Posso ver alertas de estoque baixo?',
      answer: 'Sim! O sistema exibe avisos quando produtos estão com estoque baixo (5 unidades ou menos), ajudando você a priorizar doações de itens mais necessários no momento.'
    },
    {
      question: 'Como o sistema calcula o impacto das minhas doações?',
      answer: 'O sistema rastreia o peso total doado, número de cestas que suas doações ajudaram a formar e estima quantas pessoas foram beneficiadas. Os relatórios mostram médias semanais e tendências de suas contribuições.'
    }
  ];

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
