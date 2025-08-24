package br.com.faitec.foodcare.implementation.service.tools;

import br.com.faitec.foodcare.port.service.tools.ResourceFileService;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class ResourceFileServiceImpl implements ResourceFileService {

    @Override
    public String read(String filePath) throws IOException {
        ClassPathResource resource = new ClassPathResource(filePath);
        return Files.readString(Paths.get(resource.getURI()), StandardCharsets.UTF_8);
    }
}