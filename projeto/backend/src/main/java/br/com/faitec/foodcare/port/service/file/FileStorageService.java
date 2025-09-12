package br.com.faitec.foodcare.port.service.file;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FileStorageService {
    String storeFile(MultipartFile file, String directory);
    List<String> storeFiles(List<MultipartFile> files, String directory);
    boolean deleteFile(String filePath);
}