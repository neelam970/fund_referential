from rest_framework import serializers
from .models import Fund
class FundSerializer(serializers.ModelSerializer):
    def validate_fund_name(self,value):
        if not value.strip():
            raise serializers.ValidationError(
                "fund name canot be empty"
            )
        return value

    def validate_currency(self,value):
        if len(value)!=3:
            raise serializers.ValidationError(
                "Currency must be a 3-letter code."
            )
        if not value.isalpha():
            raise serializers.ValidationError(
                "Currency must contain only letters."
            )
        return value.upper()
    def validate_country(self, value):

        if not value.strip():
            raise serializers.ValidationError(
                "Country cannot be empty."
            )

        if not all(char.isalpha() or char.isspace() for char in value):
            raise serializers.ValidationError(
                "Country must contain only letters and spaces."
            )

        return value.strip()

    def validate_fund_type(self, value):

        if not value.strip():
            raise serializers.ValidationError(
                "Fund type cannot be empty."
            )

        return value.strip()
    def validate_manager(self, value):

        if not value.strip():
            raise serializers.ValidationError(
                "Manager cannot be empty."
            )

        return value.strip()
    class Meta:
        model=Fund
        fields="__all__"