package br.com.faitec.foodcare.port.service.product;

public interface UpdateQuantityService {
    boolean updateQuantity(final int id, final int newStock);
}
