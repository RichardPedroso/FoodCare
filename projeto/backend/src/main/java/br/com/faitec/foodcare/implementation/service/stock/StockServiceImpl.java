package br.com.faitec.foodcare.implementation.service.stock;

import br.com.faitec.foodcare.domain.Stock;
import br.com.faitec.foodcare.port.dao.stock.StockDao;
import br.com.faitec.foodcare.port.service.stock.StockService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementação do serviço de estoque.
 * Gerencia quantidades disponíveis de produtos com validações de negócio.
 */
@Service
public class StockServiceImpl implements StockService {

    private final StockDao stockDao;

    /** Construtor com injeção do DAO de estoque */
    public StockServiceImpl(StockDao stockDao) {
        this.stockDao = stockDao;
    }

    /** 
     * Cria um novo item de estoque com validações.
     * Verifica produto válido e opção de doação positiva.
     */
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

    /** Atualiza um item de estoque com verificação de consistência de ID */
    @Override
    public void update(int id, Stock entity) {
        if (id > 0 && entity != null && entity.getId() == id) {
            stockDao.update(id, entity);
        }
    }

    /** Busca todos os itens de estoque de um produto específico */
    @Override
    public List<Stock> findByProductId(int productId) {
        if (productId <= 0) {
            return List.of();
        }
        return stockDao.findByProductId(productId);
    }
}