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
    private double unit;
    private int donationId;
    private int productId;
}