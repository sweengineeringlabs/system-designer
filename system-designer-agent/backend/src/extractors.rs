use axum::{
    async_trait,
    extract::{rejection::JsonRejection, FromRequest, Request},
    Json,
};
use serde::de::DeserializeOwned;
use validator::Validate;

use crate::error::AppError;

/// A JSON extractor that validates the payload using the `validator` crate
pub struct ValidatedJson<T>(pub T);

#[async_trait]
impl<S, T> FromRequest<S> for ValidatedJson<T>
where
    S: Send + Sync,
    T: DeserializeOwned + Validate,
{
    type Rejection = AppError;

    async fn from_request(req: Request, state: &S) -> Result<Self, Self::Rejection> {
        let result: Result<Json<T>, JsonRejection> = Json::from_request(req, state).await;

        let Json(value) = result.map_err(|e| AppError::BadRequest(e.body_text()))?;

        value.validate().map_err(|e| {
            let errors: Vec<String> = e
                .field_errors()
                .into_iter()
                .flat_map(|(field, errors)| {
                    errors.iter().map(move |err| {
                        format!(
                            "{}: {}",
                            field,
                            err.message.as_ref().map(|c| c.to_string()).unwrap_or_else(|| "invalid".to_string())
                        )
                    })
                })
                .collect();
            AppError::Validation(errors.join("; "))
        })?;

        Ok(ValidatedJson(value))
    }
}
