# TODO: Complete CRUD for 'objetos' resource

## Tasks
- [x] Add GET /objetos route to retrieve all objetos
- [x] Add GET /objetos/:id route to retrieve a single objeto by ID
- [x] Add POST /objetos route to create a new objeto with validation
- [x] Add PUT /objetos/:id route to update an existing objeto (partial updates allowed)
- [x] Add DELETE /objetos/:id route to delete an objeto by ID
- [ ] Test all routes using Bruno (user responsibility)

## Notes
- Use the existing 'questoes' CRUD as a template.
- Required fields for POST: titulo, categoria, local, dataExpiracao, palavraPasse.
- For PUT, keep existing values if fields are not provided.
- Ensure proper error handling and status codes.
