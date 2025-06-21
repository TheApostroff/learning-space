from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    id: str
    email: EmailStr
    first_name: str
    last_name: str

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    first_name: str | None = None
    last_name: str | None = None
    email: EmailStr | None = None
    password: str | None = None
    
class UserLogin(BaseModel):
    password: str