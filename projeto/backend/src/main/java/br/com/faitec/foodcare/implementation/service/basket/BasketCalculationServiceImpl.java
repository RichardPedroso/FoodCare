package br.com.faitec.foodcare.implementation.service.basket;

import br.com.faitec.foodcare.domain.BasketItem;
import br.com.faitec.foodcare.domain.Product;
import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.port.dao.product.ProductDao;
import br.com.faitec.foodcare.port.service.basket.BasketCalculationService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BasketCalculationServiceImpl implements BasketCalculationService {
    
    private final ProductDao productDao;
    
    public BasketCalculationServiceImpl(ProductDao productDao) {
        this.productDao = productDao;
    }

    @Override
    public List<BasketItem> calculateBasicBasket(UserModel user) {
        List<BasketItem> basketItems = new ArrayList<>();
        List<Product> allProducts = productDao.findAll();
        
        // Necessidades mensais por adulto
        basketItems.addAll(calculateFoodRequirements(allProducts, user.getPeopleQuantity()));
        
        // Produtos para crianças (apenas se hasChildren = true)
        if (user.isHasChildren()) {
            String[] childProducts = {"Gelatina", "Bolacha recheada", "Biscoito de polvilho"};
            
            for (String productName : childProducts) {
                Product product = findProductByName(allProducts, productName);
                if (product != null) {
                    basketItems.add(new BasketItem(product.getId(), product.getName(), 
                                                 2, product.getUnitQuantity(), 
                                                 product.getUnitType()));
                }
            }
        }
        
        return basketItems;
    }
    
    private List<BasketItem> calculateFoodRequirements(List<Product> allProducts, int peopleQuantity) {
        List<BasketItem> items = new ArrayList<>();
        
        // Necessidades mensais por adulto
        items.add(calculateProductNeed(allProducts, "Arroz", 3.9, "KG", peopleQuantity));
        items.add(calculateProductNeed(allProducts, "Feijão", 4.3, "KG", peopleQuantity));
        items.add(calculateProductNeed(allProducts, "Açúcar", 3.0, "KG", peopleQuantity));
        items.add(calculateProductNeed(allProducts, "Café", 600.0, "G", peopleQuantity));
        items.add(calculateProductNeed(allProducts, "Leite", 7.5, "L", peopleQuantity));
        items.add(calculateProductNeed(allProducts, "Farinha", 1.5, "KG", peopleQuantity));
        items.add(calculateProductNeed(allProducts, "Macarrão", 500.0, "G", peopleQuantity));
        items.add(calculateProductNeed(allProducts, "Óleo", 900.0, "ML", peopleQuantity));
        
        return items.stream().filter(item -> item != null).collect(java.util.stream.Collectors.toList());
    }
    
    private BasketItem calculateProductNeed(List<Product> allProducts, String productName, 
                                          double monthlyNeedPerPerson, String needUnit, int peopleQuantity) {
        Product product = findProductByName(allProducts, productName);
        if (product == null) return null;
        
        double totalNeeded = monthlyNeedPerPerson * peopleQuantity;
        double convertedNeeded = convertToProductUnit(totalNeeded, needUnit, product.getUnitType());
        int unitsNeeded = (int) Math.ceil(convertedNeeded / product.getUnitQuantity());
        
        return new BasketItem(product.getId(), product.getName(), unitsNeeded, 
                            product.getUnitQuantity(), product.getUnitType());
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
    public List<BasketItem> calculateHygieneBasket(UserModel user) {
        List<BasketItem> basketItems = new ArrayList<>();
        List<Product> allProducts = productDao.findAll();
        
        // Produtos de higiene (1 unidade cada)
        String[] hygieneProducts = {"Sabão em pó", "Amaciante", "Detergente", 
                                   "Água sanitária", "Desinfetante", "Sabonete", 
                                   "Creme dental"};
        
        for (String productName : hygieneProducts) {
            Product product = findProductByName(allProducts, productName);
            if (product != null) {
                basketItems.add(new BasketItem(product.getId(), product.getName(), 
                                             1, product.getUnitQuantity(), 
                                             product.getUnitType()));
            }
        }
        
        return basketItems;
    }
    
    private Product findProductByName(List<Product> products, String name) {
        return products.stream()
                .filter(product -> product.getName().equals(name))
                .findFirst()
                .orElse(null);
    }
}