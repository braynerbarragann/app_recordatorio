from pathlib import Path

import joblib
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

ruta_modelo = Path(__file__).with_name("modelo_intenciones.joblib")
modelo = joblib.load(ruta_modelo)

app = FastAPI(title="Clasificador de intenciones")


class Mensaje(BaseModel):
    texto: str = Field(min_length=1)

UMBRAL_CONFIANZA = 0.45


@app.get("/health")
def verificar_servicio():
    return {"estado": "listo"}


@app.post("/predecir")
def predecir_intencion(mensaje: Mensaje):
    texto = mensaje.texto.strip()

    if not texto:
        raise HTTPException(status_code=400, detail="El texto no puede estar vacío.")

    intencion = modelo.predict([texto])[0]
    probabilidades = modelo.predict_proba([texto])[0]
    confianza = float(max(probabilidades))

    intencion_predicha = str(modelo.predict([texto])[0])
    probabilidades = modelo.predict_proba([texto])[0]
    confianza = float(max(probabilidades))
    
    requiere_menu = confianza < UMBRAL_CONFIANZA
    intencion = (
        "pedir_opcion_del_menu"
        if requiere_menu
        else intencion_predicha
    )
    
    return {
        "intencion": intencion,
        "confianza": round(confianza, 4),
        "requiere_menu": requiere_menu,
    }