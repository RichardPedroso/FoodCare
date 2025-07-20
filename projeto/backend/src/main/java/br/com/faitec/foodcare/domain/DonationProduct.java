package br.com.faitec.foodcare.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DonationProduct {
    private int id;
    private double quantity;
    private String expirationDate;
    private String unit; // kg ou L
    private int productId;
    private int donationId;
}