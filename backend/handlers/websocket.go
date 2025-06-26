package handlers

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"ai-copilot-backend/services"
)

type ChatHandler struct {
	bigtableService *services.BigtableService
	geminiService   *services.GeminiService
	upgrader        websocket.Upgrader
}

func NewChatHandler(bt *services.BigtableService, g *services.GeminiService) *ChatHandler {
	return &ChatHandler{
		bigtableService: bt,
		geminiService:   g,
		upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true // Allow all origins for assignment
			},
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
		},
	}
}

type Message struct {
	Type      string `json:"type"`
	Content   string `json:"content"`
	Timestamp int64  `json:"timestamp,omitempty"`
}

func (h *ChatHandler) HandleWebSocket(c *gin.Context) {
	conn, err := h.upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("❌ Failed to upgrade connection: %v", err)
		return
	}
	defer conn.Close()

	log.Printf("🔌 WebSocket connection established from %s", c.ClientIP())

	// Send welcome message
	welcomeMsg := Message{
		Type:      "system",
		Content:   "Welcome to AI Copilot! I'm here to help you. Ask me anything!",
		Timestamp: time.Now().Unix(),
	}
	if err := conn.WriteJSON(welcomeMsg); err != nil {
		log.Printf("❌ Error sending welcome message: %v", err)
		return
	}

	for {
		var msg Message
		err := conn.ReadJSON(&msg)
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("❌ WebSocket error: %v", err)
			}
			break
		}

		if msg.Type == "user_message" {
			log.Printf("💬 Received message: %s", msg.Content)

			// Generate AI response
			response, err := h.geminiService.GenerateResponse(msg.Content)
			if err != nil {
				log.Printf("❌ Error generating response: %v", err)
				response = "I'm sorry, I encountered an error processing your request. Please try again."
			}

			// Save to Bigtable (async) - only if Bigtable is available
			if h.bigtableService != nil {
				go func() {
					if err := h.bigtableService.SaveMessage(msg.Content, response); err != nil {
						log.Printf("❌ Error saving message: %v", err)
					}
				}()
			} else {
				log.Printf("💬 Chat message (not persisted): %s -> %s", msg.Content, response)
			}

			// Send response back
			aiMsg := Message{
				Type:      "ai_response",
				Content:   response,
				Timestamp: time.Now().Unix(),
			}

			if err := conn.WriteJSON(aiMsg); err != nil {
				log.Printf("❌ Error writing message: %v", err)
				break
			}

			log.Printf("🤖 Sent response: %s", response)
		}
	}

	log.Printf("🔌 WebSocket connection closed")
}

func (h *ChatHandler) GetChatHistory(c *gin.Context) {
	if h.bigtableService == nil {
		c.JSON(200, gin.H{
			"success": true,
			"data":    []map[string]string{},
			"count":   0,
			"message": "Chat history not available - Bigtable service not configured for local development",
			"bigtable_available": false,
		})
		return
	}

	history, err := h.bigtableService.GetChatHistory()
	if err != nil {
		log.Printf("❌ Error fetching chat history: %v", err)
		c.JSON(500, gin.H{"error": "Failed to fetch chat history"})
		return
	}

	c.JSON(200, gin.H{
		"success": true,
		"data":    history,
		"count":   len(history),
		"bigtable_available": true,
	})
}

func (h *ChatHandler) HealthCheck(c *gin.Context) {
	c.JSON(200, gin.H{
		"status":    "healthy",
		"timestamp": time.Now().Unix(),
		"service":   "ai-copilot-backend",
		"version":   "1.0.0",
		"bigtable_available": h.bigtableService != nil,
	})
}
