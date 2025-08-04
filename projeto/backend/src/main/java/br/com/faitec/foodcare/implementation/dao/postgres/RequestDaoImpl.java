package br.com.faitec.foodcare.implementation.dao.postgres;

import br.com.faitec.foodcare.domain.Request;
import br.com.faitec.foodcare.port.dao.request.RequestDao;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Repository
public class RequestDaoImpl implements RequestDao {

    private final List<Request> requests = new ArrayList<>();
    private final AtomicInteger idGenerator = new AtomicInteger(1);

    @Override
    public int create(Request entity) {
        int id = idGenerator.getAndIncrement();
        entity.setId(id);
        requests.add(entity);
        return id;
    }

    @Override
    public void delete(int id) {
        requests.removeIf(request -> request.getId() == id);
    }

    @Override
    public Request findByid(int id) {
        return requests.stream()
                .filter(request -> request.getId() == id)
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<Request> findAll() {
        return new ArrayList<>(requests);
    }

    @Override
    public void update(int id, Request entity) {
        for (int i = 0; i < requests.size(); i++) {
            if (requests.get(i).getId() == id) {
                entity.setId(id);
                requests.set(i, entity);
                break;
            }
        }
    }

    @Override
    public List<Request> findByUserId(int userId) {
        return requests.stream()
                .filter(request -> request.getUserId() == userId)
                .collect(Collectors.toList());
    }

    @Override
    public List<Request> findByStatus(Request.RequestStatus status) {
        return requests.stream()
                .filter(request -> request.getStatus() == status)
                .collect(Collectors.toList());
    }

    @Override
    public List<Request> findByRequestType(Request.RequestType requestType) {
        return requests.stream()
                .filter(request -> request.getRequestType() == requestType)
                .collect(Collectors.toList());
    }

    @Override
    public boolean updateStatus(int id, Request.RequestStatus newStatus) {
        Request request = findByid(id);
        if (request != null) {
            request.setStatus(newStatus);
            return true;
        }
        return false;
    }
}