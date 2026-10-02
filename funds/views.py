from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Fund,FundHistory
from .serializers import FundSerializer
from rest_framework.pagination import PageNumberPagination
from drf_spectacular.utils import extend_schema
@extend_schema(
    methods=["GET"],
    description="List all funds with search, filtering and pagination."
)
@extend_schema(
    methods=["POST"],
    description="Create a new fund after validating the submitted fund data."
)
@api_view(["GET","POST"])
def fund_list(request):
    if request.method=="GET":
       funds = Fund.objects.all().order_by("id")
       status=request.GET.get("status")
       country=request.GET.get("country")
       currency=request.GET.get("currency")
       search = request.GET.get("search")
       if search:
        funds = funds.filter(
            Q(fund_code__icontains=search) |
            Q(fund_name__icontains=search) |
            Q(manager__icontains=search)
        )
       if status:
           funds=funds.filter(status=status)
       if country:
           funds=funds.filter(country=country)
       if currency:
           funds=funds.filter(currency=currency)
       paginator = PageNumberPagination()
       paginator.page_size = 20

       result_page = paginator.paginate_queryset(
            funds,
            request
        )

       serializer = FundSerializer(
            result_page,
            many=True
        )

       return paginator.get_paginated_response(
        serializer.data
        )
        
    elif request.method=="POST":
        serializer=FundSerializer(data=request.data)
        if serializer.is_valid():
            fund=serializer.save()
            return Response(FundSerializer(fund).data,status=201)
        return Response(serializer.errors,status=400)
@extend_schema(
    methods=["GET"],
    description="Retrieve details of a specific fund using its fund code."
)
@extend_schema(
    methods=["PATCH"],
    description="Partially update a fund. Every changed field is recorded in FundHistory."
)
@api_view(["GET","PATCH"])
def fund_detail(request, fund_code):

    try:
        fund = Fund.objects.get(fund_code=fund_code)

    except Fund.DoesNotExist:
        return Response(
            {"error": "Fund not found"},
            status=404
        )
    if request.method == "GET":
        serializer = FundSerializer(fund)
        return Response(serializer.data)
    old_values = {}

    for field in request.data.keys():
        if hasattr(fund, field):
            old_values[field] = getattr(fund, field)


    serializer = FundSerializer(
        fund,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():

        updated_fund= serializer.save()
        # Create history
        for field, old_value in old_values.items():

            new_value = getattr(updated_fund, field)

            if old_value != new_value:
                FundHistory.objects.create(
                    fund=updated_fund,
                    field_name=field,
                    old_value=str(old_value),
                    new_value=str(new_value),
                    changed_by=request.user.username
                )

        return Response(
            FundSerializer(updated_fund).data
        )

    return Response(
        serializer.errors,
        status=400
    )
