from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from .models import Fund,FundHistory


class FundAPITest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="testpass123"
        )

        self.client = APIClient()

        self.client.force_authenticate(
            user=self.user
        )

        self.fund = Fund.objects.create(
            fund_code="TEST001",
            fund_name="Test Equity Fund",
            fund_type="Equity",
            currency="USD",
            country="USA",
            manager="Test Manager",
            status="ACTIVE"
        )

    def test_fund_list(self):

        response = self.client.get(
            "/api/funds/"
        )

        self.assertEqual(
            response.status_code,
            200
        )
    def test_fund_list_requires_authentication(self):

        client = APIClient()

        response = client.get(
            "/api/funds/"
        )

        self.assertEqual(
            response.status_code,
            403
        )

    def test_create_fund(self):

        data = {
            "fund_code": "NEW001",
            "fund_name": "New Equity Fund",
            "fund_type": "Equity",
            "currency": "USD",
            "country": "USA",
            "manager": "New Manager",
            "status": "ACTIVE"
        }

        response = self.client.post(
            "/api/funds/",
            data,
            format="json"
        )

        self.assertEqual(
            response.status_code,
            201
        )

        self.assertTrue(
            Fund.objects.filter(
                fund_code="NEW001"
            ).exists()
        )

    def test_create_fund_invalid_currency(self):

        data = {
            "fund_code": "INVALID001",
            "fund_name": "Invalid Currency Fund",
            "fund_type": "Equity",
            "currency": "US123",
            "country": "USA",
            "manager": "Test Manager",
            "status": "ACTIVE"
        }

        response = self.client.post(
            "/api/funds/",
            data,
            format="json"
        )

        self.assertEqual(
            response.status_code,
            400
        )

        self.assertIn(
            "currency",
            response.data
        )
    def test_update_fund_creates_history(self):

        response = self.client.patch(
            f"/api/funds/{self.fund.fund_code}/",
            {
                "status": "INACTIVE"
            },
            format="json"
        )

        self.assertEqual(
            response.status_code,
            200
        )

        # Check fund was updated
        self.fund.refresh_from_db()

        self.assertEqual(
            self.fund.status,
            "INACTIVE"
        )

        # Check history was created
        history = FundHistory.objects.filter(
            fund=self.fund,
            field_name="status"
        ).first()

        self.assertIsNotNone(history)

        self.assertEqual(
            history.old_value,
            "ACTIVE"
        )

        self.assertEqual(
            history.new_value,
            "INACTIVE"
        )

        self.assertEqual(
            history.changed_by,
            "testuser"
        )