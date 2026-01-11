package com.example.mydhissia.ai;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EmbeddingService {

    private final EmbeddingModel embeddingModel;

    public EmbeddingService(EmbeddingModel embeddingModel) {
        this.embeddingModel = embeddingModel;
    }

    public List<Double> embed(String text) {
        return embeddingModel.embed(text);
    }
}
