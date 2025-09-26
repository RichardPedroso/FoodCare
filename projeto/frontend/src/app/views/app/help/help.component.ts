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

  get isBeneficiary(): boolean {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      return user.userType === 'beneficiary';
    }
    return false;
  }

  get currentFaqs() {
    if (this.isAdmin) {
      return this.adminFaqs;
    } else if (this.isDonor) {
      return this.donorFaqs;
    } else if (this.isBeneficiary) {
      return this.beneficiaryFaqs;
    } else {
      return this.beneficiaryFaqs; // fallback para beneficiários
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

  beneficiaryFaqs = [
    {
      question: 'Como solicitar uma cesta básica?',
      answer: 'Acesse "Fazer Ação" e clique em "Solicitar Cesta Básica". O sistema calculará automaticamente os produtos baseado no número de pessoas da sua família e se você tem crianças. Limite: uma cesta por mês.'
    },
    {
      question: 'Como solicitar uma cesta de higiene?',
      answer: 'Use "Solicitar Cesta de Higiene" na seção "Fazer Ação". A cesta inclui produtos essenciais de higiene pessoal. Você pode solicitar uma cesta de higiene por mês, independente da cesta básica.'
    },
    {
      question: 'Como o sistema calcula minha cesta básica?',
      answer: 'O cálculo é baseado no número de pessoas informado no seu cadastro. Produtos como arroz e feijão são multiplicados pela quantidade de pessoas. Se você tem crianças, produtos infantis (bolacha, gelatina, brinquedos) são adicionados automaticamente.'
    },
    {
      question: 'Posso visualizar minha cesta antes de solicitar?',
      answer: 'Sim! Use o botão "Pré-visualizar Cesta" para ver exatamente quais produtos e quantidades você receberá antes de confirmar a solicitação. Isso ajuda a planejar melhor suas necessidades.'
    },
    {
      question: 'Como acompanhar minhas solicitações?',
      answer: 'Acesse "Acompanhar Ações" para ver todas suas solicitações de cestas com status: Pendente (aguardando processamento), Coletada (já retirada) ou Cancelada. Você pode ver detalhes dos produtos de cada cesta.'
    },
    {
      question: 'Quando posso fazer uma nova solicitação?',
      answer: 'O sistema permite uma solicitação de cesta básica e uma de higiene por mês. Se você já solicitou no mês atual, o sistema mostrará a data em que poderá fazer a próxima solicitação.'
    },
    {
      question: 'O que acontece se não houver estoque suficiente?',
      answer: 'O sistema verifica automaticamente o estoque antes de processar sua solicitação. Se algum produto estiver em falta, você será notificado e a solicitação será cancelada para evitar expectativas não atendidas.'
    },
    {
      question: 'Como gerar relatórios das minhas solicitações?',
      answer: 'Use "Gerar Relatório" para ver estatísticas completas: total de cestas básicas e de higiene recebidas, número total de itens, solicitações por semana e histórico mensal de recebimentos.'
    },
    {
      question: 'Posso atualizar informações da minha família?',
      answer: 'Sim, é importante manter seus dados atualizados (número de pessoas, presença de crianças) pois isso afeta diretamente o cálculo da sua cesta básica. Entre em contato com a administração para atualizar essas informações.'
    }
  ];

  // Perguntas frequentes específicas para administradores
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
