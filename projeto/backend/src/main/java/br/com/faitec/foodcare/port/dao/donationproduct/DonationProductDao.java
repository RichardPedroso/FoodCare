package br.com.faitec.foodcare.port.dao.donationproduct;

import br.com.faitec.foodcare.domain.DonationProduct;
import br.com.faitec.foodcare.port.dao.crud.CrudDao;

import java.util.List;

public interface DonationProductDao extends CrudDao<DonationProduct> {
    List<DonationProduct> findByDonationId(int donationId);
    List<DonationProduct> findByProductId(int productId);
}