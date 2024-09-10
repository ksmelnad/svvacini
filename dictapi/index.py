from fastapi import FastAPI, Request, HTTPException
from dictapi.utils import dict_utils

app = FastAPI()

@app.get("/dict-api")
def get_roots():
    return {"message": "Roots are ---"}

@app.post("/dict-api")
async def create_root(request: Request):
    try:
        request_data = await request.json()
        # print(request_data)
        query = request_data["query"]
    except:
        raise HTTPException(status_code=400, detail= "Invalid JSON data")

    if not request_data:
        raise HTTPException(status_code=400, detail= "No data provided")
    
    roots = dict_utils.get_roots(query)

    return {"query": query, "roots": roots }