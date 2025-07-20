package br.com.faitec.foodcare.implementation.dao.postgres;

import br.com.faitec.foodcare.domain.Municipality;
import br.com.faitec.foodcare.port.dao.municipality.MunicipalityDao;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Repository
public class MunicipalityDaoImpl implements MunicipalityDao {

    private final List<Municipality> municipalities = new ArrayList<>();
    private final AtomicInteger idGenerator = new AtomicInteger(1);

    @Override
    public int create(Municipality entity) {
        int id = idGenerator.getAndIncrement();
        entity.setId(id);
        municipalities.add(entity);
        return id;
    }

    @Override
    public void delete(int id) {
        municipalities.removeIf(municipality -> municipality.getId() == id);
    }

    @Override
    public Municipality findByid(int id) {
        return municipalities.stream()
                .filter(municipality -> municipality.getId() == id)
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<Municipality> findAll() {
        return new ArrayList<>(municipalities);
    }

    @Override
    public void update(int id, Municipality entity) {
        for (int i = 0; i < municipalities.size(); i++) {
            if (municipalities.get(i).getId() == id) {
                entity.setId(id);
                municipalities.set(i, entity);
                break;
            }
        }
    }

    @Override
    public List<Municipality> findByCity(String city) {
        if (city == null || city.isEmpty()) {
            return new ArrayList<>();
        }
        
        return municipalities.stream()
                .filter(municipality -> municipality.getCity().equalsIgnoreCase(city))
                .collect(Collectors.toList());
    }
}