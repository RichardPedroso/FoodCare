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

@Service
public class BasketManagementServiceImpl implements BasketManagementService {

    private final ProductDao productDao;
    private final StockService stockService;
    private final DonationProductDao donationProductDao;
    private static final int MINIMUM_DAYS = 30;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public BasketManagementServiceImpl(ProductDao productDao, StockService stockService, 
                                     DonationProductDao donationProductDao) {
        this.productDao = productDao;
        this.stockService = stockService;
        this.donationProductDao = donationProductDao;
    }



    @Override
    public boolean validateBasketItem(int productId, double quantity, String unit) {
        if (quantity <= 0) {
            return false;
        }
        
        Product product = productDao.findByid(productId);
        if (product == null) {
            return false;
        }
        
        return unit != null && (unit.equals("KG") || unit.equals("G") || unit.equals("L") || unit.equals("ML"));
    }
    
    private boolean isValidForBasket(String expirationDate) {
        try {
            LocalDate expDate = LocalDate.parse(expirationDate, DATE_FORMATTER);
            LocalDate today = LocalDate.now();
            return ChronoUnit.DAYS.between(today, expDate) > MINIMUM_DAYS;
        } catch (Exception e) {
            return false;
        }
    }
    
    private int getDaysUntilExpiration(String expirationDate) {
        try {
            LocalDate expDate = LocalDate.parse(expirationDate, DATE_FORMATTER);
            LocalDate today = LocalDate.now();
            return (int) ChronoUnit.DAYS.between(today, expDate);
        } catch (Exception e) {
            return 0;
        }
    }
    
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
        return products.stream()
                .map(product -> {
                    List<br.com.faitec.foodcare.domain.DonationProduct> validProducts = 
                        donationProductDao.findAll().stream()
                            .filter(dp -> dp.getProductId() == product.getId())
                            .filter(dp -> isValidForBasket(dp.getExpirationDate()))
                            .sorted((a, b) -> Integer.compare(
                                getDaysUntilExpiration(a.getExpirationDate()),
                                getDaysUntilExpiration(b.getExpirationDate())
                            ))
                            .collect(java.util.stream.Collectors.toList());
                    
                    double baseQuantity = product.getUnitQuantity();
                    double adjustedQuantity = baseQuantity * peopleQuantity;
                    
                    if (hasChildren) {
                        if (numberOfChildren > 0 && isChildProduct(product)) {
                            adjustedQuantity += (baseQuantity * numberOfChildren * 0.5);
                        } else {
                            adjustedQuantity *= 1.2;
                        }
                    }
                    
                    double availableQuantity = validProducts.stream()
                            .mapToDouble(br.com.faitec.foodcare.domain.DonationProduct::getQuantity)
                            .sum();
                    
                    int finalQuantity = (int) Math.min(adjustedQuantity, availableQuantity);
                    
                    return new BasketItem(
                            product.getId(),
                            product.getName(),
                            finalQuantity,
                            product.getUnitQuantity(),
                            product.getUnitType()
                    );
                })
                .filter(item -> item.getQuantity() > 0)
                .collect(java.util.stream.Collectors.toList());
    }
}