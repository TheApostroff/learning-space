package services

import (
	"crypto/rand"
	"encoding/hex"
)

// GenerateID generates a simple random ID
func GenerateID() string {
	bytes := make([]byte, 16)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}
