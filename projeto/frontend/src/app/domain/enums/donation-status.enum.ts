export enum DonationStatus {
  PENDENTE = 'Pendente',
  EM_ESTOQUE = 'Em estoque',
  UTILIZADA = 'Utilizada',
  REJEITADA = 'Rejeitada'
}

export const DONATION_STATUS_LABELS = {
  [DonationStatus.PENDENTE]: 'Pendente',
  [DonationStatus.EM_ESTOQUE]: 'Em estoque',
  [DonationStatus.UTILIZADA]: 'Utilizada',
  [DonationStatus.REJEITADA]: 'Rejeitada'
};