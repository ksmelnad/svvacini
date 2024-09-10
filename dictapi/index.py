from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dictapi.utils import dict_utils

app = FastAPI()

origins = ["http://localhost:3000", "https://svvacini.vercel.app"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/dictapi")
def get_roots():
    return {"message": "This is dictapi."}

@app.post("/dictapi")
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