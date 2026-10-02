from django.db import models

# Create your models here.
class Fund(models.Model):
    fund_code=models.CharField(
        max_length=50,
        unique=True
    )
    fund_name=models.CharField(
        max_length=200
        
    )
    fund_type=models.CharField(
        max_length=50
    )
    currency=models.CharField(
        max_length=20,
        db_index=True
    )
    country=models.CharField(
        max_length=100,
        db_index=True
    )
    manager=models.CharField(
        max_length=200
    )
    status=models.CharField(
        max_length=50,
        choices=[
            ("ACTIVE","Active"),("INACTIVE","Inactive"),("CLOSED","Closed")
        ],
        default="ACTIVE",
        db_index=True
    )
    created_at=models.DateTimeField(
        auto_now_add=True
    )
    updated_at=models.DateTimeField(
        auto_now=True
    )
class FundHistory(models.Model):
    fund=models.ForeignKey(Fund,on_delete=models.PROTECT,related_name="History")
    field_name=models.CharField(max_length=50)
    old_value=models.TextField(null=True,blank=True)
    new_value=models.TextField(null=True,blank=True)
    changed_by=models.CharField(max_length=50)
    changed_at=models.DateTimeField(auto_now_add=True)


