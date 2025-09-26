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

/**
 * Implementação do serviço de integração entre doações e estoque.
 * Processa doações recebidas e as converte em itens de estoque disponíveis.
 */
@Service
public class DonationStockIntegrationServiceImpl implements DonationStockIntegrationService {
    
    private final DonationService donationService;
    private final DonationProductService donationProductService;
    private final StockService stockService;
    
    // Constantes para validação de produtos
    private static final int MINIMUM_DAYS = 15;  // Mínimo de dias para aceitar no estoque
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /** Construtor com injeção dos serviços necessários */
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

    /** 
     * Valida se um produto pode ser aceito no estoque baseado na data de vencimento.
     * Produtos devem ter pelo menos 15 dias de validade.
     */
    private boolean isValidForStock(String expirationDate) {
        try {
            System.out.println("Validando data de validade: " + expirationDate);
            
            // Produtos sem data de validade são aceitos (não perecíveis)
            if (expirationDate == null || expirationDate.isEmpty() || "null".equals(expirationDate)) {
                System.out.println("Produto sem data de validade - ACEITO");
                return true;
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
        int actualUnits = (int) donationProduct.getUnit();
        addToStockWithUnits(donationProduct, actualUnits);
    }
    
    /** 
     * Adiciona produtos ao estoque com quantidade específica.
     * Atualiza estoque existente ou cria novo registro.
     */
    public void addToStockWithUnits(DonationProduct donationProduct, int unitsToAdd) {
        int productId = donationProduct.getProductId();
        
        // Usar diretamente o campo unit como número de unidades a adicionar
        int actualUnitsToAdd = (int) donationProduct.getUnit();
        
        System.out.println("=== ADICIONANDO AO ESTOQUE ===");
        System.out.println("ProductId: " + productId);
        System.out.println("Unidades a adicionar: " + actualUnitsToAdd);

        // Buscar estoque existente para este produto
        List<Stock> existingStocks = stockService.findByProductId(productId);
        
        if (!existingStocks.isEmpty()) {
            // Atualiza estoque existente
            Stock existingStock = existingStocks.get(0);
            int newStock = existingStock.getActualStock() + actualUnitsToAdd;
            existingStock.setActualStock(newStock);
            stockService.update(existingStock.getId(), existingStock);
            System.out.println("Estoque atualizado de " + existingStock.getActualStock() + " para " + newStock);
        } else {
            // Cria novo registro de estoque
            Stock newStock = new Stock();
            newStock.setProductId(productId);
            newStock.setDonationOption(1.0);
            newStock.setActualStock(actualUnitsToAdd);
            stockService.create(newStock);
            System.out.println("Novo estoque criado com " + actualUnitsToAdd + " unidades");
        }
        
        System.out.println("=== FIM ADICÃO AO ESTOQUE ===");
    }
}