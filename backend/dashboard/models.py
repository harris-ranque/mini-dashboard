from django.db import models

# Create your models here.

class Client(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return str(self.name)

class Target(models.Model):
    client = models.OneToOneField(
        Client,
        on_delete=models.CASCADE,
        related_name='targets',
    )

    monthly_goal = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    def __str__(self) -> str:
        return f"{self.client.name} Target"

class Sales(models.Model):
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='sales',
    )

    product_name = models.CharField(max_length=255)

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.client.name} - {self.amount}"
    