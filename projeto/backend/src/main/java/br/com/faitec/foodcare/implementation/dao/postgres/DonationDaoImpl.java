package br.com.faitec.foodcare.implementation.dao.postgres;

import br.com.faitec.foodcare.domain.Donation;
import br.com.faitec.foodcare.port.dao.donation.DonationDao;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Repository
public class DonationDaoImpl implements DonationDao {

    private final List<Donation> donations = new ArrayList<>();
    private final AtomicInteger idGenerator = new AtomicInteger(1);

    @Override
    public int create(Donation entity) {
        int id = idGenerator.getAndIncrement();
        entity.setId(id);
        donations.add(entity);
        return id;
    }

    @Override
    public void delete(int id) {
        donations.removeIf(donation -> donation.getId() == id);
    }

    @Override
    public Donation findByid(int id) {
        return donations.stream()
                .filter(donation -> donation.getId() == id)
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<Donation> findAll() {
        return new ArrayList<>(donations);
    }

    @Override
    public void update(int id, Donation entity) {
        for (int i = 0; i < donations.size(); i++) {
            if (donations.get(i).getId() == id) {
                entity.setId(id);
                donations.set(i, entity);
                break;
            }
        }
    }

    @Override
    public List<Donation> findByUserId(int userId) {
        return donations.stream()
                .filter(donation -> donation.getUserId() == userId)
                .collect(Collectors.toList());
    }
}