package br.com.faitec.foodcare.port.service.tools;

import java.io.IOException;

public interface ResourceFileService {
    String read(String filePath) throws IOException;
}