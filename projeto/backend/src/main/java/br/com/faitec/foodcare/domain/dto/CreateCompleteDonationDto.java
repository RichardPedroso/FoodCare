package br.com.faitec.foodcare.domain.dto;

import br.com.faitec.foodcare.domain.Donation;
import br.com.faitec.foodcare.domain.DonationProduct;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateCompleteDonationDto {
    private String donationDate;
    private int userId;
    private List<DonationProductDto> products;
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DonationProductDto {
        private double quantity;
        private String expirationDate;
        private String unit;
        private int productId;
        
        public DonationProduct toDonationProduct(int donationId) {
            DonationProduct dp = new DonationProduct();
            dp.setQuantity(this.quantity);
            dp.setExpirationDate(this.expirationDate);
            dp.setUnit(this.unit);
            dp.setProductId(this.productId);
            dp.setDonationId(donationId);
            return dp;
        }
    }
    
    public Donation toDonation() {
        Donation donation = new Donation();
        donation.setDonationDate(this.donationDate);
        donation.setUserId(this.userId);
        return donation;
    }
}