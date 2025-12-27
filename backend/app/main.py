from fastapi import FastAPI

app = FastAPI(title="Conquora")

@app.get("/health")
def health_check():
    return {"status": "ok"}
