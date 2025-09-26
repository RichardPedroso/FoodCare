package br.com.faitec.foodcare.implementation.service.basket;

import br.com.faitec.foodcare.domain.BasketItem;
import br.com.faitec.foodcare.domain.Product;
import br.com.faitec.foodcare.domain.Stock;
import br.com.faitec.foodcare.port.dao.product.ProductDao;
import br.com.faitec.foodcare.port.dao.donationproduct.DonationProductDao;
import br.com.faitec.foodcare.port.service.basket.BasketManagementService;
import br.com.faitec.foodcare.port.service.stock.StockService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

import java.util.List;

/**
 * Implementação do serviço de gerenciamento de cestas básicas.
 * Calcula cestas personalizadas, valida produtos e otimiza seleção de estoque.
 */
@Service
public class BasketManagementServiceImpl implements BasketManagementService {

    private final ProductDao productDao;
    private final StockService stockService;
    private final DonationProductDao donationProductDao;
    
    // Constantes para validação de produtos
    private static final int MINIMUM_DAYS = 30;  // Mínimo de dias para vencimento
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /** Construtor com injeção dos DAOs e serviços necessários */
    public BasketManagementServiceImpl(ProductDao productDao, StockService stockService, 
                                     DonationProductDao donationProductDao) {
        this.productDao = productDao;
        this.stockService = stockService;
        this.donationProductDao = donationProductDao;
    }



    /** 
     * Valida se um item pode ser adicionado à cesta.
     * Verifica quantidade positiva, existência do produto e unidade válida.
     */
    @Override
    public boolean validateBasketItem(int productId, double quantity, Product.MeasureType unit) {
        if (quantity <= 0) {
            return false;
        }
        
        Product product = productDao.findByid(productId);
        if (product == null) {
            return false;
        }
        
        // Valida unidades de medida aceitas
        return unit != null && (unit == Product.MeasureType.kg || unit == Product.MeasureType.g || 
                               unit == Product.MeasureType.l || unit == Product.MeasureType.ml);
    }
    
    /** 
     * Verifica se um produto é válido para cesta (não vence em menos de 30 dias).
     * Garante que os beneficiários recebam produtos com prazo adequado.
     */
    private boolean isValidForBasket(String expirationDate) {
        try {
            LocalDate expDate = LocalDate.parse(expirationDate, DATE_FORMATTER);
            LocalDate today = LocalDate.now();
            return ChronoUnit.DAYS.between(today, expDate) > MINIMUM_DAYS;
        } catch (Exception e) {
            return false;
        }
    }
    
    /** Calcula quantos dias restam até o vencimento de um produto */
    private int getDaysUntilExpiration(String expirationDate) {
        try {
            LocalDate expDate = LocalDate.parse(expirationDate, DATE_FORMATTER);
            LocalDate today = LocalDate.now();
            return (int) ChronoUnit.DAYS.between(today, expDate);
        } catch (Exception e) {
            return 0;
        }
    }
    
    /** Identifica produtos específicos para crianças */
    private boolean isChildProduct(Product product) {
        String[] childProducts = {"Gelatina", "Bolacha recheada", "Biscoito de polvilho", "Leite"};
        return java.util.Arrays.asList(childProducts).contains(product.getName());
    }

    @Override
    public List<BasketItem> calculateBasket(int userId, int peopleQuantity, boolean hasChildren) {
        return calculateBasket(userId, peopleQuantity, hasChildren, 0);
    }

    @Override
    public List<BasketItem> getBasketForFamily(int peopleQuantity, boolean hasChildren) {
        return calculateBasket(0, peopleQuantity, hasChildren);
    }

    @Override
    public List<Stock> getStockOptions(int productId) {
        return stockService.findByProductId(productId);
    }
    
    @Override
    public List<Stock> optimizeStockSelection(int productId, double requiredQuantity) {
        List<Stock> availableOptions = stockService.findByProductId(productId);
        List<Stock> selectedOptions = new java.util.ArrayList<>();
        double remainingQuantity = requiredQuantity;
        
        // Ordenar por donation_option (maior primeiro para otimizar)
        availableOptions.sort((a, b) -> Double.compare(b.getDonationOption(), a.getDonationOption()));
        
        for (Stock option : availableOptions) {
            if (remainingQuantity <= 0) break;
            
            double optionWeight = option.getDonationOption();
            int availableUnits = option.getActualStock();
            int neededUnits = (int) Math.ceil(remainingQuantity / optionWeight);
            int unitsToUse = Math.min(neededUnits, availableUnits);
            
            if (unitsToUse > 0) {
                Stock selectedOption = new Stock();
                selectedOption.setId(option.getId());
                selectedOption.setProductId(option.getProductId());
                selectedOption.setDonationOption(option.getDonationOption());
                selectedOption.setActualStock(unitsToUse);
                selectedOptions.add(selectedOption);
                
                remainingQuantity -= unitsToUse * optionWeight;
            }
        }
        
        return selectedOptions;
    }
    
    @Override
    public boolean checkStockAvailability(int userId, int peopleQuantity, boolean hasChildren, int numberOfChildren) {
        try {
            List<BasketItem> requiredBasket = calculateBasket(userId, peopleQuantity, hasChildren, numberOfChildren);
            
            for (BasketItem item : requiredBasket) {
                List<Stock> availableStocks = stockService.findByProductId(item.getProductId());
                
                double totalAvailable = availableStocks.stream()
                        .mapToDouble(stock -> stock.getActualStock() * stock.getDonationOption())
                        .sum();
                
                if (totalAvailable < item.getQuantity()) {
                    return false; // Não há estoque suficiente para este produto
                }
            }
            
            return true; // Há estoque suficiente para toda a cesta
        } catch (Exception e) {
            return false;
        }
    }
    
    @Override
    public List<BasketItem> calculateBasket(int userId, int peopleQuantity, boolean hasChildren, int numberOfChildren) {
        List<Product> products = productDao.findAll();
        List<BasketItem> basketItems = new java.util.ArrayList<>();
        
        // Produtos básicos
        products.stream()
                .filter(product -> "basic".equals(product.getProductType()))
                .forEach(product -> {
                    double baseQuantity = getBaseQuantityForProduct(product.getName());
                    if (baseQuantity > 0) {
                        double totalQuantity = baseQuantity * peopleQuantity;
                        basketItems.add(new BasketItem(
                                product.getId(),
                                product.getName(),
                                (int) totalQuantity,
                                baseQuantity,
                                product.getMeasureType()
                        ));
                    }
                });
        
        // Produtos infantis (apenas se hasChildren = true e numberOfChildren > 0)
        if (hasChildren && numberOfChildren > 0) {
            products.stream()
                    .filter(product -> "infant".equals(product.getProductType()))
                    .forEach(product -> {
                        double baseQuantity = getInfantQuantityForProduct(product.getName());
                        if (baseQuantity > 0) {
                            double totalQuantity = baseQuantity * numberOfChildren;
                            basketItems.add(new BasketItem(
                                    product.getId(),
                                    product.getName(),
                                    (int) totalQuantity,
                                    baseQuantity,
                                    product.getMeasureType()
                            ));
                        }
                    });
        }
        
        return basketItems;
    }
    
    private double getBaseQuantityForProduct(String productName) {
        switch (productName) {
            case "Arroz": return 2.0;
            case "Feijão": return 1.0;
            case "Óleo de Soja": return 500.0;
            case "Açúcar": return 1.0;
            case "Sal": return 1.0;
            case "Farinha de Trigo": return 1.0;
            case "Café em Pó": return 250.0;
            case "Leite": return 1.0;
            case "Carne": return 500.0;
            case "Batata": return 1.0;
            case "Tomate": return 1.0;
            case "Banana": return 1.0;
            case "Manteiga": return 200.0;
            default: return 0.0;
        }
    }
    
    private double getInfantQuantityForProduct(String productName) {
        switch (productName) {
            case "Bolacha": return 200.0;
            case "Gelatina": return 85.0;
            case "Biscoitinho": return 150.0;
            case "Brinquedo": return 1.0;
            default: return 0.0;
        }
    }
}