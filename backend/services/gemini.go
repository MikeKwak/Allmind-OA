package services

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

type GeminiService struct {
	client *genai.Client
	model  *genai.GenerativeModel
}

func NewGeminiService() (*GeminiService, error) {
	apiKey := os.Getenv("GEMINI_API_KEY")

	if apiKey == "" {
		return nil, fmt.Errorf("GEMINI_API_KEY environment variable is required")
	}

	// Trim whitespace
	apiKey = strings.TrimSpace(apiKey)
	
	// Basic validation
	if len(apiKey) != 39 || !strings.HasPrefix(apiKey, "AI") {
		return nil, fmt.Errorf("invalid API key format (length: %d, prefix: %s)", len(apiKey), apiKey[:2])
	}

	log.Printf("🔧 Initializing Gemini client with API key: %s...", apiKey[:10] + "...")

	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, fmt.Errorf("failed to create Gemini client: %w", err)
	}

	model := client.GenerativeModel("gemini-1.5-flash-latest")
	log.Printf("✅ Gemini client and model initialized successfully")

	return &GeminiService{
		client: client,
		model:  model,
	}, nil
}

func (s *GeminiService) GenerateResponse(message string) (string, error) {
	if s.model == nil {
		log.Println("❌ Gemini model is nil")
		return "", fmt.Errorf("Gemini model not initialized")
	}

	log.Printf("📝 Generating response for message: \"%s\"", message)

	ctx := context.Background()
	resp, err := s.model.GenerateContent(ctx, genai.Text(message))
	if err != nil {
		log.Printf("❌ Error from Gemini API: %v", err)
		return "", fmt.Errorf("failed to generate Gemini response: %w", err)
	}

	log.Printf("🧠 Raw Gemini Response: %+v", resp)

	if len(resp.Candidates) > 0 && len(resp.Candidates[0].Content.Parts) > 0 {
		responsePart := fmt.Sprintf("%v", resp.Candidates[0].Content.Parts[0])
		log.Printf("✅ Extracted response: \"%s\"", responsePart)
		return responsePart, nil
	}

	log.Println("⚠️ Gemini response was empty or had no candidates.")
	return "I'm sorry, I couldn't generate a response at this time.", nil
}

func (s *GeminiService) Close() {
	if s.client != nil {
		s.client.Close()
	}
}
