package config

import (
	"fmt"
	"log"
	"os"

	"github.com/ilyakaznacheev/cleanenv"
)

type Config struct {
	Port   string `yaml:"port" env:"PORT" env-default:"8080"`
	Server Server `yaml:"server"`
}

type Server struct {
	Port     string `yaml:"port" env:"PORT" env-default:"8080"`
	Host     string `yaml:"host" env:"HOST" env-default:"localhost"`
	User     string `yaml:"user" env:"DB_USER" env-default:"postgres"`
	Password string `yaml:"password" env:"PASSWORD" env-default:"postgres"`
	Database string `yaml:"database" env:"DATABASE" env-default:"postgres"`
}

func NewConfig() *Config {
	cfg := Config{}

	err := cleanenv.ReadConfig(fmt.Sprintf("%s/config/%s", os.Getenv("PWD"), "config.yaml"), &cfg)
	if err != nil {
		log.Fatalf("Configuration error: %v", err)
	}

	log.Printf("Configuration: %+v", cfg)

	return &cfg
}
