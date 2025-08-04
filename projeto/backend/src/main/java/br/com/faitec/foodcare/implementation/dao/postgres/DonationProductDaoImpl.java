package br.com.faitec.foodcare.implementation.dao.postgres;

import br.com.faitec.foodcare.domain.DonationProduct;
import br.com.faitec.foodcare.port.dao.donationproduct.DonationProductDao;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Repository
public class DonationProductDaoImpl implements DonationProductDao {

    private final List<DonationProduct> donationProducts = new ArrayList<>();
    private final AtomicInteger idGenerator = new AtomicInteger(1);

    @Override
    public int create(DonationProduct entity) {
        int id = idGenerator.getAndIncrement();
        entity.setId(id);
        donationProducts.add(entity);
        return id;
    }

    @Override
    public void delete(int id) {
        donationProducts.removeIf(donationProduct -> donationProduct.getId() == id);
    }

    @Override
    public DonationProduct findByid(int id) {
        return donationProducts.stream()
                .filter(donationProduct -> donationProduct.getId() == id)
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<DonationProduct> findAll() {
        return new ArrayList<>(donationProducts);
    }

    @Override
    public void update(int id, DonationProduct entity) {
        for (int i = 0; i < donationProducts.size(); i++) {
            if (donationProducts.get(i).getId() == id) {
                entity.setId(id);
                donationProducts.set(i, entity);
                break;
            }
        }
    }

    @Override
    public List<DonationProduct> findByDonationId(int donationId) {
        return donationProducts.stream()
                .filter(donationProduct -> donationProduct.getDonationId() == donationId)
                .collect(Collectors.toList());
    }

    @Override
    public List<DonationProduct> findByProductId(int productId) {
        return donationProducts.stream()
                .filter(donationProduct -> donationProduct.getProductId() == productId)
                .collect(Collectors.toList());
    }
}