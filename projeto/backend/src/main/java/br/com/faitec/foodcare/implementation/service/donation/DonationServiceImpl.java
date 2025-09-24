package br.com.faitec.foodcare.implementation.service.donation;

import br.com.faitec.foodcare.domain.Donation;
import br.com.faitec.foodcare.port.dao.donation.DonationDao;
import br.com.faitec.foodcare.port.service.donation.DonationService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementação do serviço de doações.
 * Aplica regras de negócio e validações para gerenciamento de doações.
 */
@Service
public class DonationServiceImpl implements DonationService {
    private final DonationDao donationDao;

    /** Construtor com injeção do DAO de doações */
    public DonationServiceImpl(DonationDao donationDao) {
        this.donationDao = donationDao;
    }

    /** 
     * Cria uma nova doação com validações de negócio.
     * Verifica data, usuário válido e dados obrigatórios.
     */
    @Override
    public int create(Donation entity) {
        int invalidResponse = -1;

        // Validações de negócio
        if (entity == null) {
            return invalidResponse;
        }
        if (entity.getDonationDate() == null || entity.getDonationDate().isEmpty()) {
            return invalidResponse;
        }
        if (entity.getUserId() <= 0) {
            return invalidResponse;
        }
        
        final int id = donationDao.create(entity);
        return id;
    }

    @Override
    public void delete(int id) {
        if (id < 0) {
            return;
        }

        donationDao.delete(id);
    }

    @Override
    public Donation findById(int id) {
        if (id < 0) {
            return null;
        }

        Donation entity = donationDao.findByid(id);
        return entity;
    }

    @Override
    public List<Donation> findAll() {
        final List<Donation> entities = donationDao.findAll();
        return entities;
    }

    @Override
    public void update(int id, Donation entity) {
        if (id != entity.getId()) {
            return;
        }

        Donation donation = findById(id);

        if (donation == null) {
            return;
        }

        donationDao.update(id, entity);
    }

    /** Busca todas as doações de um usuário específico */
    @Override
    public List<Donation> findByUserId(int userId) {
        if (userId < 0) {
            return List.of();
        }
        return donationDao.findByUserId(userId);
    }
}