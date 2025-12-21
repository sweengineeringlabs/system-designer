use tower_http::cors::{Any, CorsLayer};
use axum::http::Method;

pub fn cors() -> CorsLayer {
    CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(Any)
}
