package br.com.faitec.foodcare.implementation.service.donationproduct;

import br.com.faitec.foodcare.domain.DonationProduct;
import br.com.faitec.foodcare.port.dao.donationproduct.DonationProductDao;
import br.com.faitec.foodcare.port.service.donationproduct.DonationProductService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementação do serviço de produtos de doação.
 * Gerencia a associação entre doações e produtos com validações de negócio.
 */
@Service
public class DonationProductServiceImpl implements DonationProductService {
    private final DonationProductDao donationProductDao;

    /** Construtor com injeção do DAO de produtos de doação */
    public DonationProductServiceImpl(DonationProductDao donationProductDao) {
        this.donationProductDao = donationProductDao;
    }

    /** 
     * Cria uma nova associação produto-doação com validações.
     * Verifica quantidade positiva e IDs válidos de produto e doação.
     */
    @Override
    public int create(DonationProduct entity) {
        int invalidResponse = -1;

        // Validações de negócio
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

    /** Busca todos os produtos associados a uma doação específica */
    @Override
    public List<DonationProduct> findByDonationId(int donationId) {
        if (donationId < 0) {
            return List.of();
        }
        return donationProductDao.findByDonationId(donationId);
    }

    /** Busca todas as doações que contêm um produto específico */
    @Override
    public List<DonationProduct> findByProductId(int productId) {
        if (productId < 0) {
            return List.of();
        }
        return donationProductDao.findByProductId(productId);
    }
}