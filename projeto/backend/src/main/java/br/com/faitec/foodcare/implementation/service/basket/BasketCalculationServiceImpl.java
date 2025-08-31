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
        // Calcular quantas cestas básicas são necessárias baseado nas necessidades nutricionais
        int basketsNeeded = calculateBasketsNeeded(user);
        
        List<BasketItem> basketItems = new ArrayList<>();
        List<Product> allProducts = productDao.findAll();
        
        // Composição de cestas básicas
        basketItems.addAll(getStandardBasketItems(allProducts, basketsNeeded));
        
        // Produtos para crianças (apenas se hasChildren = true)
        if (user.isHasChildren()) {
            basketItems.addAll(getChildBasketItems(allProducts, basketsNeeded));
        }
        
        return basketItems;
    }
    
    private int calculateBasketsNeeded(UserModel user) {
        List<Product> allProducts = productDao.findAll();
        int maxBasketsNeeded = 0;
        
        // Calcular necessidades mensais e determinar quantas cestas são necessárias
        Object[][] requirements = {
            {3.9, "KG", "Arroz"},
            {4.3, "KG", "Feijão"},
            {3.0, "KG", "Açúcar"},
            {600.0, "G", "Café"},
            {7.5, "L", "Leite"},
            {1.5, "KG", "Farinha"},
            {500.0, "G", "Macarrão"},
            {900.0, "ML", "Óleo"}
        };
        
        for (Object[] req : requirements) {
            double neededQuantity = (Double) req[0] * user.getPeopleQuantity();
            String unitType = (String) req[1];
            String productName = (String) req[2];
            
            Product product = findProductByName(allProducts, productName);
            if (product != null) {
                // Converter para mesma unidade se necessário
                double convertedNeeded = convertToProductUnit(neededQuantity, unitType, product.getUnitType());
                int unitsNeeded = (int) Math.ceil(convertedNeeded / product.getUnitQuantity());
                
                // Cada cesta contém 2 unidades deste produto
                int basketsForThisProduct = (int) Math.ceil(unitsNeeded / 2.0);
                maxBasketsNeeded = Math.max(maxBasketsNeeded, basketsForThisProduct);
            }
        }
        
        return maxBasketsNeeded;
    }
    
    private List<BasketItem> getStandardBasketItems(List<Product> allProducts, int basketQuantity) {
        List<BasketItem> items = new ArrayList<>();
        
        // Produtos básicos de alimentos - 2 unidades de cada por cesta
        String[] basicFoodProducts = {"Arroz", "Feijão", "Açúcar", "Café", "Leite", 
                                     "Farinha", "Macarrão", "Óleo"};
        
        for (String productName : basicFoodProducts) {
            Product product = findProductByName(allProducts, productName);
            if (product != null) {
                int quantity = 2 * basketQuantity; // 2 unidades por cesta
                items.add(new BasketItem(product.getId(), product.getName(), 
                                       quantity, product.getUnitQuantity(), 
                                       product.getUnitType()));
            }
        }
        
        return items;
    }
    
    private List<BasketItem> getChildBasketItems(List<Product> allProducts, int basketQuantity) {
        List<BasketItem> items = new ArrayList<>();
        
        // Produtos infantis - 2 unidades de cada por cesta
        String[] childProducts = {"Gelatina", "Bolacha recheada", "Biscoito de polvilho"};
        
        for (String productName : childProducts) {
            Product product = findProductByName(allProducts, productName);
            if (product != null) {
                int quantity = 2 * basketQuantity; // 2 unidades por cesta
                items.add(new BasketItem(product.getId(), product.getName(), 
                                       quantity, product.getUnitQuantity(), 
                                       product.getUnitType()));
            }
        }
        
        return items;
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