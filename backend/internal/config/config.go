package config

import (
	"github.com/ilyakaznacheev/cleanenv"
)

type Config struct {
	Port   string `env:"PORT" env-default:"8080"`
	Server Server `yaml:"server"`
}

type Server struct {
	Port     string `yaml:"port" env:"PORT" env-default:"8080"`
	Host     string `yaml:"host" env:"HOST" env-default:"localhost"`
	User     string `yaml:"user" env:"USER" env-default:"postgres"`
	Password string `yaml:"password" env:"PASSWORD" env-default:"postgres"`
	Database string `yaml:"database" env:"DATABASE" env-default:"postgres"`
}

func NewConfig() (*Config, error) {
	cfg := &Config{}
	if err := cleanenv.ReadConfig("config.yml", cfg); err != nil {
		return nil, err
	}
	return cfg, nil
}
