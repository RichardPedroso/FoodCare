package br.com.faitec.foodcare.implementation.service.stock;

import br.com.faitec.foodcare.domain.Stock;
import br.com.faitec.foodcare.port.dao.stock.StockDao;
import br.com.faitec.foodcare.port.service.stock.StockService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockServiceImpl implements StockService {

    private final StockDao stockDao;

    public StockServiceImpl(StockDao stockDao) {
        this.stockDao = stockDao;
    }

    @Override
    public int create(Stock entity) {
        if (entity == null || entity.getProductId() <= 0 || entity.getDonationOption() <= 0) {
            return -1;
        }
        return stockDao.create(entity);
    }

    @Override
    public void delete(int id) {
        if (id > 0) {
            stockDao.delete(id);
        }
    }

    @Override
    public Stock findById(int id) {
        if (id <= 0) {
            return null;
        }
        return stockDao.findByid(id);
    }

    @Override
    public List<Stock> findAll() {
        return stockDao.findAll();
    }

    @Override
    public void update(int id, Stock entity) {
        if (id > 0 && entity != null && entity.getId() == id) {
            stockDao.update(id, entity);
        }
    }

    @Override
    public List<Stock> findByProductId(int productId) {
        if (productId <= 0) {
            return List.of();
        }
        return stockDao.findByProductId(productId);
    }
}