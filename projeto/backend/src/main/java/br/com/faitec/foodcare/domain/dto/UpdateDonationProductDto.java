package br.com.faitec.foodcare.domain.dto;

import br.com.faitec.foodcare.domain.DonationProduct;
import lombok.Data;

@Data
public class UpdateDonationProductDto {
    private int id;
    private double quantity;
    private String expirationDate;
    private String unit;
    private int productId;
    private int donationId;

    public DonationProduct toDonationProduct() {
        final DonationProduct entity = new DonationProduct();
        entity.setId(id);
        entity.setQuantity(quantity);
        entity.setExpirationDate(expirationDate);
        entity.setUnit(unit);
        entity.setProductId(productId);
        entity.setDonationId(donationId);
        return entity;
    }
}