package br.com.faitec.foodcare.domain.dto;

import br.com.faitec.foodcare.domain.Donation;
import lombok.Data;

@Data
public class UpdateDonationDto {
    private int id;
    private String donationDate;
    private int userId;
    private String donationStatus;

    public Donation toDonation() {
        final Donation entity = new Donation();
        entity.setId(id);
        entity.setDonationDate(donationDate);
        entity.setUserId(userId);
        entity.setDonationStatus(donationStatus);
        return entity;
    }
}