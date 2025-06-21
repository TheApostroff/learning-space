from sqlalchemy.orm import Session
from app.models.users import User
from app.schemas.users import UserCreate, UserResponse, UserPasswordUpdate
from app.services.auth import hash_password, verify_password


def create_user(db: Session, user: UserCreate) -> UserResponse:
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise ValueError("User with this email already exists")

    db_user = User(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        password=hash_password(user.password),
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return UserResponse.from_orm(db_user)


def get_user_by_email(db: Session, email: str) -> UserResponse | None:
    db_user = db.query(User).filter(User.email == email).first()
    if db_user:
        return UserResponse.from_orm(db_user)
    return None


def update_user(db: Session, user: UserResponse) -> UserResponse:
    db_user = db.query(User).filter(User.id == user.id).first()
    if not db_user:
        raise ValueError("User not found")
    db_user = User(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
    )

    db.commit()
    db.refresh(db_user)
    return UserResponse.from_orm(db_user)


def update_user_password(
    db: Session, user_id: str, old_password: str, new_password: str
) -> None:
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise ValueError("User not found")
    if not verify_password(old_password, db_user.password):
        raise ValueError("Old password is incorrect")
    db_user.password = hash_password(new_password)
    db.commit()
    return None


def authenticate_user(db: Session, email: str, password: str) -> UserResponse | None:
    db_user = db.query(User).filter(User.email == email).first()
    if not db_user or not verify_password(password, db_user.password):
        return None
    return UserResponse.from_orm(db_user)


def get_user_by_id(db: Session, user_id: str) -> UserResponse | None:
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        return UserResponse.from_orm(db_user)
    return None


def get_all_users(db: Session) -> list[UserResponse]:
    db_users = db.query(User).all()
    return [UserResponse.from_orm(user) for user in db_users]
