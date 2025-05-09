import openai
import os
import re
import json
from google.cloud import translate_v2 as translate
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Attempt to load Prisma client
try:
    from prisma import Prisma
    prisma_test = Prisma()
    prisma_test.connect()
    prisma_test.disconnect()
    USING_MOCK_DB = False
    print("Successfully connected to Prisma client")
except Exception as e:
    print(f"Prisma client error: {e}")
    print("Using mock database implementation instead")
    USING_MOCK_DB = True

    class Prisma:
        def connect(self):
            print("Mock database connection established")
            return self

        def disconnect(self):
            print("Mock database disconnected")

        @property
        def product(self):
            class ProductQuery:
                def find_many(self, where=None, include=None, **kwargs):
                    print(f"Mock query: where={where}, include={include}")
                    return [
                        {
                            "id": 1,
                            "name": "Mock Laptop",
                            "description": "Test device",
                            "priceInPeswass": 500000,
                            "category": "Electronics",
                            "store": {"name": "Mock Store"},
                            "imageUrl": "https://via.placeholder.com/150"
                        }
                    ]
            return ProductQuery()

# Initialize FastAPI app
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set API keys
api_key_path = os.path.join(os.getcwd(), "chatbot_api/api_key.txt")
with open(api_key_path, "r") as file:
    openai.api_key = file.read().strip()

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.abspath("chatbot_api/regina-chatbot-gcloudtranslate.json")

# Connect database
db_url = os.getenv("DATABASE_URL", "file:dev.db")
print(f"Connecting to database: {db_url}")
db = Prisma()
db.connect()

# Pydantic models
class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    conversation_history: List[Dict[str, str]] = []

class ChatResponse(BaseModel):
    response: str
    products: List[dict]
    conversation_history: List[Dict[str, str]]
    language: str

@app.get("/")
def read_root():
    return {"message": "Chatbot API is running!"}

@app.get("/test-db-connection")
async def test_db_connection():
    try:
        products = db.product.find_many(include={"store": True})
        return {"status": "success", "products": products}
    except Exception as e:
        return {"status": "failed", "error": str(e)}

def translate_text(text, target_language):
    try:
        client = translate.Client()
        result = client.translate(text, target_language=target_language)
        return result["translatedText"]
    except Exception as e:
        print(f"Translation error: {e}")
        return text

def generate_openai_response(prompt_en, catalog_data, conversation_history):
    try:
        system_message = (
            "You are a shopping assistant for Academic City University's e-commerce platform.\n\n"
            "IMPORTANT RULES:\n"
            "1. ONLY provide info about products in the store database.\n"
            "2. If an item isn’t available, say so clearly.\n"
            "3. NEVER invent info.\n"
            "4. Use the catalog data only.\n"
            "5. Be helpful and concise.\n"
            "6. Suggest similar available items if uncertain."
        )

        catalog_context = "Our store inventory includes:\n"
        for item in catalog_data:
            name = item.get("name", "")
            category = item.get("category", "")
            store = item.get("store", {}).get("name", "")
            price = item.get("priceInPeswass", 0) / 100
            catalog_context += f"- {name} (Category: {category}, Store: {store}, Price: GH₵{price:.2f})\n"

        messages = [
            {"role": "system", "content": system_message},
            {"role": "system", "content": catalog_context}
        ]

        messages.extend(conversation_history[-10:])
        messages.append({"role": "user", "content": prompt_en})

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.4,
            max_tokens=250,
            top_p=1,
            frequency_penalty=0.5,
            presence_penalty=0.5
        )
        return response["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"OpenAI error: {e}")
        return "Sorry, I'm having trouble with the AI response right now."

def search_database(query, language):
    if not query:
        return []

    query_terms = re.sub(r"[^\w\s]", "", query.lower()).split()
    results = []

    try:
        for term in query_terms:
            if len(term) < 3:
                continue
            products = db.product.find_many(
                where={
                    "OR": [
                        {"name": {"contains": term}},
                        {"description": {"contains": term}},
                        {"category": {"contains": term}}
                    ]
                },
                include={"store": True}
            )
            for product in products:
                product_dict = dict(product)
                if not any(p["id"] == product_dict["id"] for p in results):
                    results.append(product_dict)
        return results
    except Exception as e:
        print(f"Search error: {e}")
        return []

def format_product_info(product, language):
    price = product.get("priceInPeswass", 0) / 100
    formatted = {
        "id": product.get("id"),
        "name": product.get("name", "N/A"),
        "description": product.get("description", "N/A"),
        "price": price,
        "formattedPrice": f"GH₵{price:.2f}",
        "store": product.get("store", {}).get("name", "N/A"),
        "category": product.get("category", "N/A"),
        "imageUrl": product.get("imageUrl", "https://via.placeholder.com/150")
    }

    if language == "tw":
        try:
            formatted["name"] = translate_text(formatted["name"], "tw")
            formatted["description"] = translate_text(formatted["description"], "tw")
            formatted["category"] = translate_text(formatted["category"], "tw")
        except Exception as e:
            print(f"Translation error: {e}")
    return formatted

@app.post("/chatbot/", response_model=ChatResponse)
def chatbot_api(request: ChatRequest):
    print(f"Received request: {request.dict()}")

    user_input = request.message.strip()
    language = request.language
    conversation_history = request.conversation_history or []

    if not user_input:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    try:
        catalog_data = db.product.find_many(include={"store": True})
        catalog_list = [dict(product) for product in catalog_data]
    except Exception as e:
        print(f"Catalog error: {e}")
        catalog_list = []

    user_input_en = translate_text(user_input, "en") if language == "tw" else user_input
    search_results = search_database(user_input_en, language)
    response_en = generate_openai_response(user_input_en, catalog_list, conversation_history)

    if not search_results:
        search_results = search_database(response_en, language)

    formatted_results = [format_product_info(p, language) for p in search_results]
    chatbot_response = translate_text(response_en, "tw") if language == "tw" else response_en

    conversation_history.append({"role": "user", "content": user_input})
    conversation_history.append({"role": "assistant", "content": chatbot_response})

    return ChatResponse(
        response=chatbot_response,
        products=formatted_results,
        conversation_history=conversation_history,
        language=language
    )
