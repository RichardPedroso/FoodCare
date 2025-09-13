package br.com.faitec.foodcare.implementation.service.request;

import br.com.faitec.foodcare.domain.BasketItem;
import br.com.faitec.foodcare.domain.Request;
import br.com.faitec.foodcare.domain.Stock;
import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.port.service.basket.BasketManagementService;
import br.com.faitec.foodcare.port.service.request.RequestService;
import br.com.faitec.foodcare.port.service.request.RequestStockIntegrationService;
import br.com.faitec.foodcare.port.service.stock.StockService;
import br.com.faitec.foodcare.port.service.user.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequestStockIntegrationServiceImpl implements RequestStockIntegrationService {
    
    private final RequestService requestService;
    private final UserService userService;
    private final BasketManagementService basketManagementService;
    private final StockService stockService;

    public RequestStockIntegrationServiceImpl(RequestService requestService,
                                            UserService userService,
                                            BasketManagementService basketManagementService,
                                            StockService stockService) {
        this.requestService = requestService;
        this.userService = userService;
        this.basketManagementService = basketManagementService;
        this.stockService = stockService;
    }

    @Override
    public boolean processRequestCompletion(int requestId) {
        try {
            Request request = requestService.findById(requestId);
            if (request == null || request.getStatus() != Request.RequestStatus.COMPLETED) {
                return false;
            }

            UserModel user = userService.findById(request.getUserId());
            if (user == null) {
                return false;
            }

            return consumeStockForBasket(user.getId(), requestId);
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean consumeStockForBasket(int userId, int requestId) {
        try {
            UserModel user = userService.findById(userId);
            if (user == null) {
                return false;
            }

            // Calcular a cesta necessária para este usuário
            List<BasketItem> basketItems = basketManagementService.calculateBasket(
                userId, 
                user.getPeopleQuantity(), 
                user.isHasChildren(), 
                user.getNumberOfChildren()
            );

            // Consumir estoque para cada item da cesta
            for (BasketItem item : basketItems) {
                if (!consumeStockForProduct(item.getProductId(), item.getQuantity())) {
                    // Se não conseguir consumir algum produto, falha toda a operação
                    return false;
                }
            }

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean consumeStockForProduct(int productId, int requiredQuantity) {
        try {
            List<Stock> availableStocks = stockService.findByProductId(productId);
            
            if (availableStocks.isEmpty()) {
                return false;
            }

            // Ordenar por donation_option (usar primeiro as menores embalagens)
            availableStocks.sort((a, b) -> Double.compare(a.getDonationOption(), b.getDonationOption()));

            double remainingQuantity = requiredQuantity;

            for (Stock stock : availableStocks) {
                if (remainingQuantity <= 0) {
                    break;
                }

                if (stock.getActualStock() > 0) {
                    double stockWeight = stock.getDonationOption();
                    int unitsNeeded = (int) Math.ceil(remainingQuantity / stockWeight);
                    int unitsToConsume = Math.min(unitsNeeded, stock.getActualStock());

                    if (unitsToConsume > 0) {
                        // Diminuir o estoque
                        stock.setActualStock(stock.getActualStock() - unitsToConsume);
                        stockService.update(stock.getId(), stock);

                        remainingQuantity -= unitsToConsume * stockWeight;
                    }
                }
            }

            // Retorna true se conseguiu consumir toda a quantidade necessária
            return remainingQuantity <= 0;
        } catch (Exception e) {
            return false;
        }
    }
}