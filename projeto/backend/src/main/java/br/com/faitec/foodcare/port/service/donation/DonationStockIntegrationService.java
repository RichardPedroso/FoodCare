package br.com.faitec.foodcare.port.service.donation;

public interface DonationStockIntegrationService {
    boolean processDonationToStock(int donationId);
    boolean confirmDonationReceipt(int donationId);
}