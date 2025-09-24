package br.com.faitec.foodcare.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Donation {
    private int id;
    private String donationDate;
    private int userId;
    private String donationStatus;
}