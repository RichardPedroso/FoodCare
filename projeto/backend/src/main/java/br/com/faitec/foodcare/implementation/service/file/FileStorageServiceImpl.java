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

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final String uploadDir = "uploads/";

    @Override
    public String storeFile(MultipartFile file, String directory) {
        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir + directory);
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);
            
            return directory + "/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar arquivo: " + e.getMessage());
        }
    }

    @Override
    public List<String> storeFiles(List<MultipartFile> files, String directory) {
        List<String> filePaths = new ArrayList<>();
        for (MultipartFile file : files) {
            filePaths.add(storeFile(file, directory));
        }
        return filePaths;
    }

    @Override
    public boolean deleteFile(String filePath) {
        try {
            Path path = Paths.get(uploadDir + filePath);
            return Files.deleteIfExists(path);
        } catch (IOException e) {
            return false;
        }
    }
}