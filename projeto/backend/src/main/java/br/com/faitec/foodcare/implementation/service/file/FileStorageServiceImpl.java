package br.com.faitec.foodcare.implementation.service.file;

import br.com.faitec.foodcare.port.service.file.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Implementação do serviço de armazenamento de arquivos.
 * Gerencia upload, armazenamento e deleção de arquivos no sistema de arquivos local.
 */
@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final String uploadDir = "uploads/";  // Diretório base para uploads

    /** 
     * Armazena um arquivo no sistema de arquivos.
     * Gera nome único usando UUID para evitar conflitos.
     */
    @Override
    public String storeFile(MultipartFile file, String directory) {
        try {
            // Gera nome único para o arquivo
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir + directory);
            
            // Cria diretório se não existir
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Salva o arquivo
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);
            
            return directory + "/" + fileName;  // Retorna caminho relativo
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar arquivo: " + e.getMessage());
        }
    }

    /** Armazena múltiplos arquivos em lote */
    @Override
    public List<String> storeFiles(List<MultipartFile> files, String directory) {
        List<String> filePaths = new ArrayList<>();
        for (MultipartFile file : files) {
            filePaths.add(storeFile(file, directory));
        }
        return filePaths;
    }

    /** Remove um arquivo do sistema de arquivos */
    @Override
    public boolean deleteFile(String filePath) {
        try {
            Path path = Paths.get(uploadDir + filePath);
            return Files.deleteIfExists(path);  // Retorna true se deletou com sucesso
        } catch (IOException e) {
            return false;
        }
    }
}