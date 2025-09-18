package br.com.faitec.foodcare.implementation.service.donation;

import br.com.faitec.foodcare.domain.Donation;
import br.com.faitec.foodcare.domain.DonationProduct;
import br.com.faitec.foodcare.domain.Stock;
import br.com.faitec.foodcare.port.service.donation.DonationService;
import br.com.faitec.foodcare.port.service.donation.DonationStockIntegrationService;
import br.com.faitec.foodcare.port.service.donationproduct.DonationProductService;
import br.com.faitec.foodcare.port.service.stock.StockService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class DonationStockIntegrationServiceImpl implements DonationStockIntegrationService {
    
    private final DonationService donationService;
    private final DonationProductService donationProductService;
    private final StockService stockService;
    private static final int MINIMUM_DAYS = 30;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public DonationStockIntegrationServiceImpl(DonationService donationService, 
                                             DonationProductService donationProductService,
                                             StockService stockService) {
        this.donationService = donationService;
        this.donationProductService = donationProductService;
        this.stockService = stockService;
    }

    @Override
    public boolean processDonationToStock(int donationId) {
        try {
            // Verificar se a doação existe
            Donation donation = donationService.findById(donationId);
            if (donation == null) {
                return false;
            }

            // Buscar todos os produtos da doação
            List<DonationProduct> donationProducts = donationProductService.findByDonationId(donationId);
            
            if (donationProducts.isEmpty()) {
                return false;
            }

            // Processar cada produto da doação
            for (DonationProduct donationProduct : donationProducts) {
                // Validar se o produto tem validade mínima
                if (!isValidForStock(donationProduct.getExpirationDate())) {
                    continue; // Pula produtos com validade insuficiente
                }

                // Converter para estoque
                addToStock(donationProduct);
            }

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean confirmDonationReceipt(int donationId) {
        return processDonationToStock(donationId);
    }
    
    public boolean processDonationToStockWithUnits(int donationId, int units) {
        try {
            Donation donation = donationService.findById(donationId);
            if (donation == null) {
                return false;
            }

            List<DonationProduct> donationProducts = donationProductService.findByDonationId(donationId);
            
            if (donationProducts.isEmpty()) {
                return false;
            }

            for (DonationProduct donationProduct : donationProducts) {
                if (!isValidForStock(donationProduct.getExpirationDate())) {
                    continue;
                }
                addToStockWithUnits(donationProduct, units);
            }

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isValidForStock(String expirationDate) {
        try {
            if (expirationDate == null || expirationDate.isEmpty()) {
                return true; // Produtos sem validade são aceitos
            }
            
            LocalDate expDate = LocalDate.parse(expirationDate, DATE_FORMATTER);
            LocalDate today = LocalDate.now();
            return ChronoUnit.DAYS.between(today, expDate) >= MINIMUM_DAYS;
        } catch (Exception e) {
            return true; // Em caso de erro na data, aceita o produto
        }
    }

    private void addToStock(DonationProduct donationProduct) {
        // Por enquanto, assumir 1 unidade. Isso precisa vir do frontend.
        addToStockWithUnits(donationProduct, 1);
    }
    
    public void addToStockWithUnits(DonationProduct donationProduct, int unitsToAdd) {
        int productId = donationProduct.getProductId();
        double donationOption = donationProduct.getQuantity();

        // Buscar estoque existente para este produto e donation_option
        List<Stock> existingStocks = stockService.findByProductId(productId);
        
        boolean stockUpdated = false;
        
        for (Stock existingStock : existingStocks) {
            if (existingStock.getDonationOption() == donationOption) {
                // Incrementar o estoque com o número de unidades doadas
                existingStock.setActualStock(existingStock.getActualStock() + unitsToAdd);
                stockService.update(existingStock.getId(), existingStock);
                stockUpdated = true;
                break;
            }
        }

        // Se não encontrou estoque existente, criar novo
        if (!stockUpdated) {
            Stock newStock = new Stock();
            newStock.setProductId(productId);
            newStock.setDonationOption(donationOption);
            newStock.setActualStock(unitsToAdd);
            stockService.create(newStock);
        }
    }
}