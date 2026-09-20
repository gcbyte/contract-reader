from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_user
from ..services.ai_service import analyze_document

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("", response_model=schemas.DocumentDetailOut, status_code=status.HTTP_201_CREATED)
async def create_document(
    payload: schemas.DocumentCreateRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    document = models.Document(
        owner_id=current_user.id,
        name=payload.name or "Untitled Document",
        type=payload.type,
        text=payload.text,
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    try:
        findings_data = await analyze_document(payload.type, payload.text)
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Document saved, but analysis failed: {error}",
        )

    for finding in findings_data:
        db.add(
            models.Finding(
                document_id=document.id,
                risk=finding.get("risk", "low"),
                title=finding.get("title", "Untitled Finding"),
                description=finding.get("description", ""),
                why_it_matters=finding.get("why_it_matters", ""),
                what_to_review=finding.get("what_to_review", ""),
            )
        )

    db.commit()
    db.refresh(document)

    return document


@router.get("", response_model=list[schemas.DocumentSummaryOut])
def list_documents(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(models.Document)
        .filter(models.Document.owner_id == current_user.id)
        .order_by(models.Document.created_at.desc())
        .all()
    )


@router.get("/{document_id}", response_model=schemas.DocumentDetailOut)
def get_document(
    document_id: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    document = (
        db.query(models.Document)
        .filter(
            models.Document.id == document_id,
            models.Document.owner_id == current_user.id,
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Document not found."
        )

    return document