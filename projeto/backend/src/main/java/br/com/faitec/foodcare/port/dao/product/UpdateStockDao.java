package br.com.faitec.foodcare.port.dao.product;

public interface UpdateStockDao {
    boolean updateStock(int productId, double quantityChange);
    double getAvailableStock(int productId);
}