package br.com.faitec.foodcare.port.dao.product;

public interface UpdateQuantityDao {
    boolean updateQuantity(final int id, final int newQuantity);
}
