package br.com.faitec.foodcare.implementation.service.municipality;

import br.com.faitec.foodcare.domain.Municipality;
import br.com.faitec.foodcare.port.dao.municipality.MunicipalityDao;
import br.com.faitec.foodcare.port.service.municipality.MunicipalityService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MunicipalityServiceImpl implements MunicipalityService {
    private final MunicipalityDao municipalityDao;

    public MunicipalityServiceImpl(MunicipalityDao municipalityDao) {
        this.municipalityDao = municipalityDao;
    }

    @Override
    public int create(Municipality entity) {
        int invalidResponse = -1;

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

    @Override
    public List<Municipality> findByCity(String city) {
        if (city == null || city.isEmpty()) {
            return List.of();
        }
        return municipalityDao.findByCity(city);
    }
}