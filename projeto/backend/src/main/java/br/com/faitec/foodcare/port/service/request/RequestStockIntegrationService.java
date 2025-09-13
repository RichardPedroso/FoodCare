package br.com.faitec.foodcare.port.service.request;

public interface RequestStockIntegrationService {
    boolean processRequestCompletion(int requestId);
    boolean consumeStockForBasket(int userId, int requestId);
}