package br.com.faitec.foodcare.domain.dto;

import br.com.faitec.foodcare.domain.Municipality;
import lombok.Data;

@Data
public class UpdateMunicipalityDto {
    private int id;
    private String street;
    private String number;
    private String neighborhood;
    private String city;
    private String zipCode;

    public Municipality toMunicipality() {
        final Municipality entity = new Municipality();
        entity.setId(id);
        entity.setStreet(street);
        entity.setNumber(number);
        entity.setNeighborhood(neighborhood);
        entity.setCity(city);
        entity.setZipCode(zipCode);
        return entity;
    }
}