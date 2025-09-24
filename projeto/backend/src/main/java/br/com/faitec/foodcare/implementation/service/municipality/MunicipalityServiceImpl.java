package br.com.faitec.foodcare.implementation.service.municipality;

import br.com.faitec.foodcare.domain.Municipality;
import br.com.faitec.foodcare.port.dao.municipality.MunicipalityDao;
import br.com.faitec.foodcare.port.service.municipality.MunicipalityService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementação do serviço de municípios.
 * Gerencia informações de localização e endereços com validações de negócio.
 */
@Service
public class MunicipalityServiceImpl implements MunicipalityService {
    private final MunicipalityDao municipalityDao;

    /** Construtor com injeção do DAO de municípios */
    public MunicipalityServiceImpl(MunicipalityDao municipalityDao) {
        this.municipalityDao = municipalityDao;
    }

    /** 
     * Cria um novo município com validações de endereço.
     * Verifica campos obrigatórios como rua e cidade.
     */
    @Override
    public int create(Municipality entity) {
        int invalidResponse = -1;

        // Validações de negócio
        if (entity == null) {
            return invalidResponse;
        }
        if (entity.getStreet() == null || entity.getStreet().isEmpty()) {
            return invalidResponse;
        }
        if (entity.getCity() == null || entity.getCity().isEmpty()) {
            return invalidResponse;
        }

        final int id = municipalityDao.create(entity);
        return id;
    }

    @Override
    public void delete(int id) {
        if (id < 0) {
            return;
        }

        municipalityDao.delete(id);
    }

    @Override
    public Municipality findById(int id) {
        if (id < 0) {
            return null;
        }

        Municipality entity = municipalityDao.findByid(id);
        return entity;
    }

    @Override
    public List<Municipality> findAll() {
        final List<Municipality> entities = municipalityDao.findAll();
        return entities;
    }

    @Override
    public void update(int id, Municipality entity) {
        if (id != entity.getId()) {
            return;
        }

        Municipality municipality = findById(id);

        if (municipality == null) {
            return;
        }

        municipalityDao.update(id, entity);
    }

    /** Busca municípios por nome da cidade (busca parcial) */
    @Override
    public List<Municipality> findByCity(String city) {
        if (city == null || city.isEmpty()) {
            return List.of();
        }
        return municipalityDao.findByCity(city);
    }
}