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
            System.out.println("=== PROCESSANDO DOAÇÃO PARA ESTOQUE ===");
            System.out.println("DonationId: " + donationId);
            
            // Verificar se a doação existe
            Donation donation = donationService.findById(donationId);
            if (donation == null) {
                System.out.println("ERRO: Doação não encontrada!");
                return false;
            }
            System.out.println("Doação encontrada: " + donation.getId());

            // Buscar todos os produtos da doação
            List<DonationProduct> donationProducts = donationProductService.findByDonationId(donationId);
            System.out.println("Produtos da doação encontrados: " + donationProducts.size());
            
            if (donationProducts.isEmpty()) {
                System.out.println("ERRO: Nenhum produto encontrado para a doação!");
                return false;
            }

            // Processar cada produto da doação
            for (DonationProduct donationProduct : donationProducts) {
                System.out.println("Processando produto: " + donationProduct.getProductId() + 
                                 ", Quantidade: " + donationProduct.getQuantity() + 
                                 ", Validade: " + donationProduct.getExpirationDate());
                
                // Validar se o produto tem validade mínima
                boolean isValid = isValidForStock(donationProduct.getExpirationDate());
                System.out.println("Produto válido para estoque: " + isValid);
                
                if (!isValid) {
                    System.out.println("Pulando produto com validade insuficiente");
                    continue; // Pula produtos com validade insuficiente
                }

                // Converter para estoque
                addToStock(donationProduct);
            }

            System.out.println("=== PROCESSAMENTO CONCLUÍDO ===");
            return true;
        } catch (Exception e) {
            System.out.println("ERRO no processamento: " + e.getMessage());
            e.printStackTrace();
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
            System.out.println("Validando data de validade: " + expirationDate);
            
            if (expirationDate == null || expirationDate.isEmpty() || "null".equals(expirationDate)) {
                System.out.println("Produto sem data de validade - ACEITO");
                return true; // Produtos sem validade são aceitos
            }
            
            LocalDate expDate = LocalDate.parse(expirationDate, DATE_FORMATTER);
            LocalDate today = LocalDate.now();
            long daysBetween = ChronoUnit.DAYS.between(today, expDate);
            
            System.out.println("Dias até vencimento: " + daysBetween + " (mínimo: " + MINIMUM_DAYS + ")");
            
            boolean isValid = daysBetween >= MINIMUM_DAYS;
            System.out.println("Resultado da validação: " + isValid);
            
            return isValid;
        } catch (Exception e) {
            System.out.println("Erro ao validar data, aceitando produto: " + e.getMessage());
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
        
        System.out.println("=== ADICIONANDO AO ESTOQUE ===");
        System.out.println("ProductId: " + productId);
        System.out.println("DonationOption: " + donationOption);
        System.out.println("UnitsToAdd: " + unitsToAdd);

        // Buscar estoque existente para este produto e donation_option
        List<Stock> existingStocks = stockService.findByProductId(productId);
        System.out.println("Estoques existentes encontrados: " + existingStocks.size());
        
        boolean stockUpdated = false;
        
        for (Stock existingStock : existingStocks) {
            System.out.println("Verificando estoque - ID: " + existingStock.getId() + 
                             ", DonationOption: " + existingStock.getDonationOption() + 
                             ", ActualStock: " + existingStock.getActualStock());
            if (existingStock.getDonationOption() == donationOption) {
                System.out.println("Encontrou estoque existente! Atualizando...");
                // Incrementar o estoque com o número de unidades doadas
                int newStock = existingStock.getActualStock() + unitsToAdd;
                existingStock.setActualStock(newStock);
                stockService.update(existingStock.getId(), existingStock);
                System.out.println("Estoque atualizado para: " + newStock);
                stockUpdated = true;
                break;
            }
        }

        // Se não encontrou estoque existente, criar novo
        if (!stockUpdated) {
            System.out.println("Criando novo estoque...");
            Stock newStock = new Stock();
            newStock.setProductId(productId);
            newStock.setDonationOption(donationOption);
            newStock.setActualStock(unitsToAdd);
            int createdId = stockService.create(newStock);
            System.out.println("Novo estoque criado com ID: " + createdId);
        }
        
        System.out.println("=== FIM ADICÃO AO ESTOQUE ===");
    }
}