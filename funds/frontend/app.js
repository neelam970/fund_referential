const API_URL = "https://fund-referential.onrender.com/api/funds/";

let authHeader = "";
let currentPage = 1;
let nextPage = null;
let previousPage = null;


/* =========================
   LOGIN
========================= */

document
    .getElementById("login-form")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const username =
            document.getElementById("username").value;

        const password =
            document.getElementById("password").value;

        authHeader =
            "Basic " + btoa(username + ":" + password);

        try {

            const response = await fetch(API_URL, {
                method: "GET",

                headers: {
                    "Authorization": authHeader
                }
            });

            if (!response.ok) {

                throw new Error(
                    "Invalid username or password"
                );
            }

            document
                .getElementById("login-section")
                .classList.add("hidden");

            document
                .getElementById("dashboard-section")
                .classList.remove("hidden");

            document
                .getElementById("login-message")
                .textContent = "";

            loadFunds();

        } catch (error) {

            document
                .getElementById("login-message")
                .textContent = error.message;

            document
                .getElementById("login-message")
                .style.color = "red";
        }

    });


/* =========================
   LOAD FUNDS
========================= */

async function loadFunds(url = API_URL) {

    try {

        const response = await fetch(url, {

            headers: {
                "Authorization": authHeader
            }

        });

        if (!response.ok) {

            throw new Error(
                "Unable to load funds"
            );
        }

        const data = await response.json();

        displayFunds(data.results);

        nextPage = data.next;
        previousPage = data.previous;

        updatePagination();

        updateStatistics();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}


/* =========================
   DISPLAY FUNDS
========================= */

function displayFunds(funds) {

    const tableBody =
        document.getElementById("fund-table-body");

    tableBody.innerHTML = "";

    if (funds.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="8">
                    No funds found.
                </td>
            </tr>
        `;

        return;
    }


    funds.forEach(fund => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${fund.fund_code}</td>

            <td>${fund.fund_name}</td>

            <td>${fund.fund_type}</td>

            <td>${fund.currency}</td>

            <td>${fund.country}</td>

            <td>${fund.manager}</td>

            <td>
                <span class="status status-${fund.status.toLowerCase()}">
                    ${fund.status}
                </span>
            </td>

            <td>
                <button
                    onclick='openEditModal(${JSON.stringify(fund)})'
                >
                    Edit
                </button>
            </td>

        `;

        tableBody.appendChild(row);

    });

}


/* =========================
   SEARCH
========================= */

document
    .getElementById("search-button")
    .addEventListener("click", function () {

        const search =
            document.getElementById("search").value.trim();

        const status =
            document.getElementById("status-filter").value;

        const country =
            document.getElementById("country-filter").value.trim();

        const currency =
            document.getElementById("currency-filter").value
                .trim()
                .toUpperCase();

        const params = new URLSearchParams();

        if (search) {
            params.append("search", search);
        }

        if (status) {
            params.append("status", status);
        }

        if (country) {
            params.append("country", country);
        }

        if (currency) {
            params.append("currency", currency);
        }

        let url = API_URL;

        if (params.toString()) {
            url += "?" + params.toString();
        }

        console.log("Searching:", url);

        currentPage = 1;

        loadFunds(url);
    });


/* =========================
   CLEAR FILTERS
========================= */

document
    .getElementById("clear-button")
    .addEventListener("click", function () {

        document.getElementById("search").value = "";

        document.getElementById("status-filter").value = "";

        document.getElementById("country-filter").value = "";

        document.getElementById("currency-filter").value = "";

        currentPage = 1;

        loadFunds();

    });


/* =========================
   CREATE FUND
========================= */

document
    .getElementById("fund-form")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        const data = {

            fund_code:
                document.getElementById("fund-code").value,

            fund_name:
                document.getElementById("fund-name").value,

            fund_type:
                document.getElementById("fund-type").value,

            currency:
                document
                    .getElementById("currency")
                    .value
                    .toUpperCase(),

            country:
                document.getElementById("country").value,

            manager:
                document.getElementById("manager").value,

            status:
                document.getElementById("status").value

        };


        try {

            const response =
                await fetch(API_URL, {

                    method: "POST",

                    headers: {

                        "Authorization": authHeader,

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify(data)

                });


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    JSON.stringify(result)
                );

            }


            document
                .getElementById("form-message")
                .textContent =
                "Fund created successfully.";

            document
                .getElementById("form-message")
                .style.color = "green";


            document
                .getElementById("fund-form")
                .reset();


            loadFunds();


        } catch (error) {

            document
                .getElementById("form-message")
                .textContent =
                error.message;

            document
                .getElementById("form-message")
                .style.color = "red";

        }

    });


/* =========================
   EDIT MODAL
========================= */

function openEditModal(fund) {

    document
        .getElementById("edit-modal")
        .classList.remove("hidden");


    document
        .getElementById("edit-fund-code")
        .value = fund.fund_code;


    document
        .getElementById("edit-fund-name")
        .value = fund.fund_name;


    document
        .getElementById("edit-fund-type")
        .value = fund.fund_type;


    document
        .getElementById("edit-currency")
        .value = fund.currency;


    document
        .getElementById("edit-country")
        .value = fund.country;


    document
        .getElementById("edit-manager")
        .value = fund.manager;


    document
        .getElementById("edit-status")
        .value = fund.status;

}


/* =========================
   UPDATE FUND
========================= */

document
    .getElementById("update-button")
    .addEventListener("click", async function () {

        const fundCode =
            document
                .getElementById("edit-fund-code")
                .value;


        const data = {

            fund_name:
                document
                    .getElementById("edit-fund-name")
                    .value,

            fund_type:
                document
                    .getElementById("edit-fund-type")
                    .value,

            currency:
                document
                    .getElementById("edit-currency")
                    .value
                    .toUpperCase(),

            country:
                document
                    .getElementById("edit-country")
                    .value,

            manager:
                document
                    .getElementById("edit-manager")
                    .value,

            status:
                document
                    .getElementById("edit-status")
                    .value

        };


        try {

            const response =
                await fetch(
                    API_URL + fundCode + "/",
                    {

                        method: "PATCH",

                        headers: {

                            "Authorization": authHeader,

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(data)

                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    JSON.stringify(result)
                );

            }


            document
                .getElementById("edit-message")
                .textContent =
                "Fund updated successfully.";

            document
                .getElementById("edit-message")
                .style.color = "green";


            setTimeout(() => {

                closeEditModal();

                loadFunds();

            }, 700);


        } catch (error) {

            document
                .getElementById("edit-message")
                .textContent =
                error.message;

            document
                .getElementById("edit-message")
                .style.color = "red";

        }

    });


/* =========================
   CLOSE MODAL
========================= */

document
    .getElementById("cancel-button")
    .addEventListener(
        "click",
        closeEditModal
    );


function closeEditModal() {

    document
        .getElementById("edit-modal")
        .classList.add("hidden");

    document
        .getElementById("edit-message")
        .textContent = "";

}


/* =========================
   LOGOUT
========================= */

document
    .getElementById("logout-button")
    .addEventListener("click", function () {

        authHeader = "";

        document
            .getElementById("dashboard-section")
            .classList.add("hidden");

        document
            .getElementById("login-section")
            .classList.remove("hidden");

        document
            .getElementById("username")
            .value = "";

        document
            .getElementById("password")
            .value = "";

    });


/* =========================
   PAGINATION
========================= */

document
    .getElementById("next-button")
    .addEventListener("click", function () {

        if (nextPage) {

            currentPage++;

            loadFunds(nextPage);

        }

    });


document
    .getElementById("previous-button")
    .addEventListener("click", function () {

        if (previousPage) {

            currentPage--;

            loadFunds(previousPage);

        }

    });


function updatePagination() {

    document
        .getElementById("page-number")
        .textContent =
        "Page " + currentPage;


    document
        .getElementById("next-button")
        .disabled =
        !nextPage;


    document
        .getElementById("previous-button")
        .disabled =
        !previousPage;

}


/* =========================
   STATISTICS
========================= */

async function updateStatistics() {

    try {

        const response =
            await fetch(
                API_URL + "?page_size=1000",
                {

                    headers: {
                        "Authorization": authHeader
                    }

                }
            );


        const data =
            await response.json();


        const funds = data.results || [];


        document
            .getElementById("total-funds")
            .textContent =
            funds.length;


        document
            .getElementById("active-funds")
            .textContent =
            funds.filter(
                fund => fund.status === "ACTIVE"
            ).length;


        document
            .getElementById("inactive-funds")
            .textContent =
            funds.filter(
                fund => fund.status === "INACTIVE"
            ).length;


        document
            .getElementById("closed-funds")
            .textContent =
            funds.filter(
                fund => fund.status === "CLOSED"
            ).length;

    } catch (error) {

        console.error(
            "Statistics error:",
            error
        );

    }

}