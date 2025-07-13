package br.com.faitec.foodcare.port.dao.product;

public interface UpdateExpirationDateDao {
    boolean updateExpirationDate(final int id, final String newExpirationDate);
}
