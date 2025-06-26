package services

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"cloud.google.com/go/bigtable"
)

type BigtableService struct {
	client *bigtable.Client
	table  *bigtable.Table
}

func NewBigtableService() (*BigtableService, error) {
	projectID := os.Getenv("GOOGLE_CLOUD_PROJECT")
	instanceID := os.Getenv("BIGTABLE_INSTANCE")

	// If no Bigtable credentials, return error with helpful message
	if projectID == "" || instanceID == "" {
		return nil, fmt.Errorf("GOOGLE_CLOUD_PROJECT and BIGTABLE_INSTANCE environment variables are required for Bigtable. For local development without Bigtable, these can be empty")
	}

	log.Printf("🔧 Initializing Bigtable client for project: %s, instance: %s", projectID, instanceID)

	ctx := context.Background()
	client, err := bigtable.NewClient(ctx, projectID, instanceID)
	if err != nil {
		return nil, fmt.Errorf("failed to create Bigtable client: %w", err)
	}

	table := client.Open("chat_history")
	log.Printf("✅ Bigtable client initialized successfully")

	return &BigtableService{
		client: client,
		table:  table,
	}, nil
}

func (s *BigtableService) SaveMessage(message, response string) error {
	// Use UNIX timestamp as row key (as per requirements)
	rowKey := fmt.Sprintf("%d", time.Now().UnixNano())

	ctx := context.Background()
	mut := bigtable.NewMutation()
	mut.Set("chat", "user_message", bigtable.Now(), []byte(message))
	mut.Set("chat", "ai_response", bigtable.Now(), []byte(response))
	mut.Set("chat", "timestamp", bigtable.Now(), []byte(time.Now().Format(time.RFC3339)))

	if err := s.table.Apply(ctx, rowKey, mut); err != nil {
		return fmt.Errorf("failed to save message to Bigtable: %w", err)
	}

	log.Printf("💾 Message saved to Bigtable with row key: %s", rowKey)
	return nil
}

func (s *BigtableService) GetChatHistory() ([]map[string]string, error) {
	ctx := context.Background()
	var history []map[string]string

	err := s.table.ReadRows(ctx, bigtable.PrefixRange(""), func(row bigtable.Row) bool {
		data := make(map[string]string)
		data["row_key"] = row.Key()

		for _, family := range row {
			for _, column := range family {
				switch column.Column {
				case "chat:user_message":
					data["user_message"] = string(column.Value)
				case "chat:ai_response":
					data["ai_response"] = string(column.Value)
				case "chat:timestamp":
					data["timestamp"] = string(column.Value)
				}
			}
		}

		history = append(history, data)
		return true
	})

	if err != nil {
		return nil, fmt.Errorf("failed to read chat history from Bigtable: %w", err)
	}

	return history, nil
}
