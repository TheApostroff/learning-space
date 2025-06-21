from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    id: str
    email: EmailStr
    first_name: str
    last_name: str

    class Config:
        orm_mode = True


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    password: str


class UserDelete(BaseModel):
    id: str
    password: str


class UserResponse(UserBase):
    pass
