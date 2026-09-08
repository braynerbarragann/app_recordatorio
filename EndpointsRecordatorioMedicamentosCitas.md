Descripcion: El proyecto consiste en una app que gestione el recordatorio de toma de medicamentos y citas medicas del usuario.

Endpoints:

USUARIOS

POST   /usuarios
GET    /usuarios/{usuario_id}
PUT    /usuarios/{usuario_id}
DELETE /usuarios/{usuario_id}

CITAS

POST   /usuarios/{usuario_id}/citas
GET    /usuarios/{usuario_id}/citas
GET    /usuarios/{usuario_id}/citas/{cita_id}
PUT    /usuarios/{usuario_id}/citas/{cita_id}
DELETE /usuarios/{usuario_id}/citas/{cita_id}

TRATAMIENTOS

POST   /usuarios/{usuario_id}/tratamientos
GET    /usuarios/{usuario_id}/tratamientos
GET    /usuarios/{usuario_id}/tratamientos/{tratamiento_id}
PUT    /usuarios/{usuario_id}/tratamientos/{tratamiento_id}
DELETE /usuarios/{usuario_id}/tratamientos/{tratamiento_id}

TRATAMIENTOS MEDICAMENTOS

POST   /usuarios/{usuario_id}/tratamientos/{tratamiento_id}/medicamentos
GET    /usuarios/{usuario_id}/tratamientos/{tratamiento_id}/medicamentos
GET    /usuarios/{usuario_id}/tratamientos/{tratamiento_id}/medicamentos/{medicamento_id}
PUT    /usuarios/{usuario_id}/tratamientos/{tratamiento_id}/medicamentos/{medicamento_id}
DELETE /usuarios/{usuario_id}/tratamientos/{tratamiento_id}/medicamentos/{medicamento_id}

TOMA MEDICAMENTOS

POST   /usuarios/{usuario_id}/tratamientos/{tratamiento_id}/medicamentos/{tratamiento-medicamento_id}/tomas
GET    /usuarios/{usuario_id}/tratamientos/{tratamiento_id}/medicamentos/{tratamiento-medicamento_id}/tomas
GET    /usuarios/{usuario_id}/tratamientos/{tratamiento_id}/medicamentos/{tratamiento-medicamento_id}/tomas/{toma_id}
PUT    /usuarios/{usuario_id}/tratamientos/{tratamiento_id}/medicamentos/{tratamiento-medicamento_id}/tomas/{toma_id}
DELETE /usuarios/{usuario_id}/tratamientos/{tratamiento_id}/medicamentos/{tratamiento-medicamento_id}/tomas/{toma_id}

MEDICAMENTOS

GET    /medicamentos
GET    /medicamentos/{medicamento_id}
POST   /medicamentos

VIAS DE ADMINISTRACION

GET   /vias-administracion
GET   /vias-administracion/{via-administracion_id}






