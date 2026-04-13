# API Endpoints Documentation

Base URL: `https://film-management-api.labse.id/api/v1`

## Film Lists

### Add Film to List
- **Method**: POST
- **Endpoint**: `/film-lists`
- **Headers**: Authorization: Bearer {token}
- **Body**:
```json
{
  "film_id": "3a30fbf0-c160-432a-b5e8-fa870d44a437",
  "list_status": "watching" // or "completed" or "plan_to_watch"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "success create film list"
}
```
- **Note**: Film must be aired (not "not_yet_aired" status)

### Get User's Film Lists
- **Method**: GET
- **Endpoint**: `/users/:id`
- **Description**: Get user detail including their film lists
- **Response**:
```json
{
  "success": true,
  "message": "success get detail user",
  "data": {
    "id": "user-id",
    "username": "username",
    "display_name": "Display Name",
    "bio": "User bio",
    "film_lists": [
      {
        "film_title": "Film Title",
        "list_status": "watching"
      }
    ],
    "reviews": [...]
  }
}
```
- **Note**: For My Lists page, first call GET `/auth/me` to get current user ID, then call GET `/users/:id`

### Update Film List Visibility
- **Method**: PATCH
- **Endpoint**: `/film-lists/:id`
- **Body**:
```json
{
  "visibility": "public" // or "private"
}
```
- **Example**: PATCH `/film-lists/abc123` with body `{"visibility":"public"}`

### Remove from List
- **Method**: DELETE
- **Endpoint**: `/film-lists/{listId}`

## Reviews

### Add Review
- **Method**: POST
- **Endpoint**: `/reviews`
- **Body**:
```json
{
  "film_id": "film-id-here",
  "rating": 8,
  "comment": "Great film!"
}
```

## Reactions

### Add Reaction to Review
- **Method**: POST
- **Endpoint**: `/reactions`
- **Body**:
```json
{
  "review_id": "review-id-here",
  "status": "like" // or "dislike"
}
```

## Notes

- All endpoints require authentication via Bearer token in Authorization header
- Check Postman documentation for complete and accurate endpoint list
- Response format: `{ success: boolean, message: string, data?: any, error?: string }`
