use std::net::SocketAddr;
use backend::app;

#[tokio::main]
async fn main() {
    let app = app();

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("Server listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}