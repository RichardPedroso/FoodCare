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
        
        // Produtos básicos de alimentos (2 unidades cada)
        String[] basicFoodProducts = {"Arroz", "Feijão", "Açúcar", "Café", "Leite", 
                                     "Farinha", "Macarrão", "Óleo"};
        
        for (String productName : basicFoodProducts) {
            Product product = findProductByName(allProducts, productName);
            if (product != null) {
                basketItems.add(new BasketItem(product.getId(), product.getName(), 
                                             2, product.getUnitQuantity(), 
                                             product.getUnitType()));
            }
        }
        
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