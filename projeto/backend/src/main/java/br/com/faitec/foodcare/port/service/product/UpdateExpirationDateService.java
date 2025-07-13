package br.com.faitec.foodcare.port.service.product;

public interface UpdateExpirationDateService {
    boolean updateExpirationDate(final int id, final String newExpirationDate);
}
