package br.com.faitec.foodcare.implementation.service.basket;

import br.com.faitec.foodcare.domain.BasketItem;
import br.com.faitec.foodcare.domain.Product;
import br.com.faitec.foodcare.domain.Stock;
import br.com.faitec.foodcare.port.dao.product.ProductDao;
import br.com.faitec.foodcare.port.service.basket.BasketManagementService;
import br.com.faitec.foodcare.port.service.stock.StockService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BasketManagementServiceImpl implements BasketManagementService {

    private final ProductDao productDao;
    private final StockService stockService;

    public BasketManagementServiceImpl(ProductDao productDao, StockService stockService) {
        this.productDao = productDao;
        this.stockService = stockService;
    }

    @Override
    public boolean addToBasket(int productId, double quantity, String unit, String expirationDate) {
        if (!validateBasketItem(productId, quantity, unit)) {
            return false;
        }
        
        Product product = productDao.findByid(productId);
        if (product == null) {
            return false;
        }
        
        List<Stock> stockOptions = stockService.findByProductId(productId);
        double convertedQuantity = convertToProductUnit(quantity, unit, product.getUnitType());
        double totalAvailable = stockOptions.stream()
                .mapToDouble(stock -> stock.getActualStock() * stock.getDonationOption())
                .sum();
        
        return totalAvailable >= convertedQuantity;
    }
    
    private double convertToProductUnit(double quantity, String fromUnit, String toUnit) {
        if (fromUnit.equals(toUnit)) return quantity;
        
        if (fromUnit.equals("KG") && toUnit.equals("G")) return quantity * 1000;
        if (fromUnit.equals("G") && toUnit.equals("KG")) return quantity / 1000;
        if (fromUnit.equals("L") && toUnit.equals("ML")) return quantity * 1000;
        if (fromUnit.equals("ML") && toUnit.equals("L")) return quantity / 1000;
        
        return quantity;
    }

    @Override
    public boolean removeFromBasket(int productId, double quantity) {
        return true;
    }

    @Override
    public List<BasketItem> getBasketItems(int donationId) {
        List<Product> products = productDao.findAll();
        return products.stream()
                .map(product -> new BasketItem(
                        product.getId(),
                        product.getName(),
                        1,
                        product.getUnitQuantity(),
                        product.getUnitType()
                ))
                .collect(Collectors.toList());
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

    @Override
    public List<BasketItem> calculateBasket(int userId, int peopleQuantity, boolean hasChildren) {
        List<Product> products = productDao.findAll();
        return products.stream()
                .map(product -> {
                    List<Stock> stockOptions = stockService.findByProductId(product.getId());
                    double totalAvailable = stockOptions.stream()
                            .mapToDouble(stock -> stock.getActualStock() * stock.getDonationOption())
                            .sum();
                    
                    double baseQuantity = product.getUnitQuantity();
                    double adjustedQuantity = baseQuantity * peopleQuantity;
                    if (hasChildren) {
                        adjustedQuantity *= 1.2;
                    }
                    
                    int finalQuantity = (int) Math.min(adjustedQuantity, totalAvailable);
                    
                    return new BasketItem(
                            product.getId(),
                            product.getName(),
                            finalQuantity,
                            product.getUnitQuantity(),
                            product.getUnitType()
                    );
                })
                .collect(Collectors.toList());
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
}