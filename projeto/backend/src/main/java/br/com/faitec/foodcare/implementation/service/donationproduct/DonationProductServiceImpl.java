package br.com.faitec.foodcare.implementation.service.donationproduct;

import br.com.faitec.foodcare.domain.DonationProduct;
import br.com.faitec.foodcare.port.dao.donationproduct.DonationProductDao;
import br.com.faitec.foodcare.port.service.donationproduct.DonationProductService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonationProductServiceImpl implements DonationProductService {
    private final DonationProductDao donationProductDao;

    public DonationProductServiceImpl(DonationProductDao donationProductDao) {
        this.donationProductDao = donationProductDao;
    }

    @Override
    public int create(DonationProduct entity) {
        int invalidResponse = -1;

        if (entity == null) {
            return invalidResponse;
        }
        if (entity.getQuantity() <= 0) {
            return invalidResponse;
        }
        if (entity.getProductId() <= 0 || entity.getDonationId() <= 0) {
            return invalidResponse;
        }
        
        final int id = donationProductDao.create(entity);
        return id;
    }

    @Override
    public void delete(int id) {
        if (id < 0) {
            return;
        }

        donationProductDao.delete(id);
    }

    @Override
    public DonationProduct findById(int id) {
        if (id < 0) {
            return null;
        }

        DonationProduct entity = donationProductDao.findByid(id);
        return entity;
    }

    @Override
    public List<DonationProduct> findAll() {
        final List<DonationProduct> entities = donationProductDao.findAll();
        return entities;
    }

    @Override
    public void update(int id, DonationProduct entity) {
        if (id != entity.getId()) {
            return;
        }

        DonationProduct donationProduct = findById(id);

        if (donationProduct == null) {
            return;
        }

        donationProductDao.update(id, entity);
    }

    @Override
    public List<DonationProduct> findByDonationId(int donationId) {
        if (donationId < 0) {
            return List.of();
        }
        return donationProductDao.findByDonationId(donationId);
    }

    @Override
    public List<DonationProduct> findByProductId(int productId) {
        if (productId < 0) {
            return List.of();
        }
        return donationProductDao.findByProductId(productId);
    }
}