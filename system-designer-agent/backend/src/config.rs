use std::net::IpAddr;
use std::env;

#[derive(Debug, Clone)]
pub struct Config {
    pub host: IpAddr,
    pub port: u16,
    pub cors_origins: Vec<String>,
    pub log_level: String,
    pub max_body_size: usize,
    pub rate_limit_per_second: u32,
    pub rate_limit_burst: u32,
}

impl Config {
    pub fn from_env() -> Result<Self, String> {
        // Load .env file if present
        let _ = dotenvy::dotenv();

        let host: IpAddr = env::var("APP_HOST")
            .unwrap_or_else(|_| "127.0.0.1".to_string())
            .parse()
            .map_err(|_| "Invalid APP_HOST")?;

        let port: u16 = env::var("APP_PORT")
            .unwrap_or_else(|_| "3000".to_string())
            .parse()
            .map_err(|_| "Invalid APP_PORT")?;

        let cors_origins: Vec<String> = env::var("APP_CORS_ORIGINS")
            .unwrap_or_else(|_| "http://localhost:5173,http://localhost:1420".to_string())
            .split(',')
            .map(|s| s.trim().to_string())
            .filter(|s| !s.is_empty())
            .collect();

        let log_level = env::var("APP_LOG_LEVEL").unwrap_or_else(|_| "info".to_string());

        let max_body_size: usize = env::var("APP_MAX_BODY_SIZE")
            .unwrap_or_else(|_| "1048576".to_string()) // 1MB default
            .parse()
            .map_err(|_| "Invalid APP_MAX_BODY_SIZE")?;

        let rate_limit_per_second: u32 = env::var("APP_RATE_LIMIT_PER_SECOND")
            .unwrap_or_else(|_| "10".to_string())
            .parse()
            .map_err(|_| "Invalid APP_RATE_LIMIT_PER_SECOND")?;

        let rate_limit_burst: u32 = env::var("APP_RATE_LIMIT_BURST")
            .unwrap_or_else(|_| "20".to_string())
            .parse()
            .map_err(|_| "Invalid APP_RATE_LIMIT_BURST")?;

        Ok(Config {
            host,
            port,
            cors_origins,
            log_level,
            max_body_size,
            rate_limit_per_second,
            rate_limit_burst,
        })
    }

    /// Default configuration for testing
    pub fn default_test() -> Self {
        Config {
            host: "127.0.0.1".parse().unwrap(),
            port: 3000,
            cors_origins: vec!["http://localhost:5173".to_string()],
            log_level: "debug".to_string(),
            max_body_size: 1024 * 1024,
            rate_limit_per_second: 100,
            rate_limit_burst: 200,
        }
    }
}

impl Default for Config {
    fn default() -> Self {
        Config::from_env().unwrap_or_else(|_| Config::default_test())
    }
}
