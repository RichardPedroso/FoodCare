package br.com.faitec.foodcare.port.service.donationproduct;

import br.com.faitec.foodcare.domain.DonationProduct;
import br.com.faitec.foodcare.port.service.crud.CrudService;

import java.util.List;

public interface DonationProductService extends CrudService<DonationProduct> {
    List<DonationProduct> findByDonationId(int donationId);
    List<DonationProduct> findByProductId(int productId);
}