package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"ai-copilot-backend/handlers"
	"ai-copilot-backend/services"
)

func main() {
	// Set Gin mode
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	log.Println("🚀 Starting AI Copilot Backend initialization...")

	// Initialize services with proper error handling
	var bigtableService *services.BigtableService
	var geminiService *services.GeminiService

	// Try to initialize Bigtable service
	log.Printf("🔧 Attempting to initialize Bigtable service...")
	bt, err := services.NewBigtableService()
	if err != nil {
		log.Printf("⚠️  Warning: Failed to initialize Bigtable service: %v", err)
		log.Println("⚠️  Chat history will not be persisted (this is normal for local development)")
		bigtableService = nil // Set to nil to indicate no Bigtable
	} else {
		log.Printf("✅ Bigtable service initialized successfully")
		bigtableService = bt
	}

	// Initialize Gemini service (required)
	log.Printf("🔧 Initializing Gemini service...")
	gm, err := services.NewGeminiService()
	if err != nil {
		log.Fatalf("❌ Failed to initialize Gemini service: %v", err)
	}
	geminiService = gm
	defer geminiService.Close()

	// Initialize handler
	chatHandler := handlers.NewChatHandler(bigtableService, geminiService)

	// Create Gin router
	r := gin.Default()

	// Configure CORS
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	r.Use(cors.New(config))

	// Health check endpoint
	r.GET("/health", chatHandler.HealthCheck)
	r.GET("/", chatHandler.HealthCheck) // Root endpoint for Cloud Run health checks

	// Chat history endpoint (always available, but returns appropriate response)
	r.GET("/api/chat/history", chatHandler.GetChatHistory)
	if bigtableService != nil {
		log.Printf("📊 Chat history endpoint enabled with Bigtable")
	} else {
		log.Printf("📊 Chat history endpoint enabled (no Bigtable - will return empty data)")
	}

	// WebSocket endpoint
	r.GET("/ws", chatHandler.HandleWebSocket)

	// Debug endpoint to check environment variables
	r.GET("/debug/env", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"GEMINI_API_KEY_PRESENT": os.Getenv("GEMINI_API_KEY") != "",
			"GEMINI_API_KEY_LENGTH":  len(os.Getenv("GEMINI_API_KEY")),
			"GEMINI_API_KEY_PREFIX": func() string {
				key := os.Getenv("GEMINI_API_KEY")
				if len(key) >= 2 {
					return key[:2]
				}
				return "N/A"
			}(),
			"GOOGLE_CLOUD_PROJECT": os.Getenv("GOOGLE_CLOUD_PROJECT"),
			"BIGTABLE_INSTANCE":    os.Getenv("BIGTABLE_INSTANCE"),
			"BIGTABLE_AVAILABLE":   bigtableService != nil,
		})
	})

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Starting AI Copilot Backend on port %s", port)
	log.Printf(" WebSocket endpoint: ws://localhost:%s/ws", port)
	log.Printf(" Health check: http://localhost:%s/health", port)
	log.Printf(" Debug env: http://localhost:%s/debug/env", port)
	if bigtableService != nil {
		log.Printf(" Chat history: http://localhost:%s/api/chat/history", port)
	}

	// Create server with timeout
	srv := &http.Server{
		Addr:         ":" + port,
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start the server
	log.Printf("✅ Server is ready to accept connections on port %s", port)
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("❌ Failed to start server: %v", err)
	}
} 