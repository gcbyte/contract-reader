from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


# ---------- Auth ----------

class SignUpRequest(BaseModel):
    first_name: str = Field(min_length=1)
    last_name: str = Field(min_length=1)
    email: EmailStr
    password: str = Field(min_length=8)


class SignInRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=8)


# ---------- User ----------

class UserOut(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: EmailStr
    avatar_url: str | None = None

    class Config:
        from_attributes = True


class ProfileUpdateRequest(BaseModel):
    first_name: str | None = Field(default=None, min_length=1)
    last_name: str | None = Field(default=None, min_length=1)


# ---------- Documents ----------

class DocumentCreateRequest(BaseModel):
    type: str = Field(pattern="^(contract|terms|privacy|other)$")
    text: str = Field(min_length=1)
    name: str | None = None


class FindingOut(BaseModel):
    risk: str
    title: str
    description: str
    why_it_matters: str
    what_to_review: str

    class Config:
        from_attributes = True


class DocumentSummaryOut(BaseModel):
    id: str
    name: str
    type: str
    created_at: datetime

    class Config:
        from_attributes = True


class DocumentDetailOut(BaseModel):
    id: str
    name: str
    type: str
    text: str
    created_at: datetime
    findings: list[FindingOut]

    class Config:
        from_attributes = True
