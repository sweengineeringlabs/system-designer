use axum::http::{HeaderValue, Method};
use tower_http::cors::{AllowOrigin, CorsLayer};

use crate::config::Config;
use crate::error::AppError;

pub fn cors_layer(config: &Config) -> Result<CorsLayer, AppError> {
    if config.cors_origins.is_empty() {
        // No CORS restrictions (development mode)
        return Ok(CorsLayer::permissive());
    }

    let origins: Vec<HeaderValue> = config
        .cors_origins
        .iter()
        .map(|origin| {
            origin
                .parse()
                .map_err(|_| AppError::Config(format!("Invalid CORS origin: {}", origin)))
        })
        .collect::<Result<Vec<_>, _>>()?;

    Ok(CorsLayer::new()
        .allow_origin(AllowOrigin::list(origins))
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers([
            axum::http::header::CONTENT_TYPE,
            axum::http::header::AUTHORIZATION,
        ])
        .max_age(std::time::Duration::from_secs(3600)))
}
