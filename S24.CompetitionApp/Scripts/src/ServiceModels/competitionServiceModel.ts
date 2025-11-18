
export class CompetitionServiceModel {

    private mainServiceUri = window.location.origin + window["baseUrl"] + "api/competition";
    private token = localStorage.getItem('auth_token');
    private headers = this.token ? {
        Authorization: `Bearer ${this.token}`
    } : {}


    // INSERT
    public insertData(obj: any, callback: (c) => void) {
        const serviceUri = this.mainServiceUri + "/CreateCompetition";

        try {
            $.ajax({
                headers: this.headers,
                type: "PUT",
                contentType: "application/json;charset=utf-8",
                url: serviceUri,
                data: JSON.stringify(obj),
                dataType: "json",
                processData: false,
                success(response) {
                    callback(response);
                },
                error(er) {
                    console.log("ERROR - S24_V2_Competition - CreateCompetition(): " + er.responseText);
                    callback(null);
                },
            });
        } catch (e) {
            console.log("ERROR - S24_V2_Competition - CreateCompetition()2: " + e.message);
            callback(null);
        }
    }

    // UPDATE
    public updateData(obj: any, callback: (c) => void) {
        const serviceUri = this.mainServiceUri + "/UpdateCompetition";

        try {
            $.ajax({
                headers: this.headers,
                type: "PUT",
                contentType: "application/json;charset=utf-8",
                url: serviceUri,
                data: JSON.stringify(obj),
                dataType: "json",
                processData: false,
                success(response) {
                    callback(response);
                },
                error(er) {
                    console.log("ERROR - S24_V2_Competition - CreateCompetition(): " + er.responseText);
                    callback(null);
                },
            });
        } catch (e) {
            console.log("ERROR - S24_V2_Competition - CreateCompetition()2: " + e.message);
            callback(null);
        }
    }

    // SELECT
    public getData(method: string, callback: (c) => void) {
        const serviceUri = `${this.mainServiceUri}/${method}`;
        try {
            $.ajax({
                headers: this.headers,
                type: "GET",
                contentType: "application/json",
                url: serviceUri,
                dataType: "json",
                success(response) {
                    callback(response);
                },
                error(er) {
                    console.log("ERROR - S24_V2_Competition - " + method + "(): " + er.responseText);
                    callback(null);
                },
            });
        } catch (e) {
            console.log("ERROR - S24_V2_Competition - " + method + "(): " + e.message);
            callback(null);
        }
    }

    // GET IMAGE

    public getImageById(id, callback: (c) => void) {
        const serviceUri = `${this.mainServiceUri}/getImage/${id}`;

        try {
            $.ajax({
                headers: this.headers,
                type: "GET",
                contentType: "application/json",
                url: serviceUri,
                dataType: "json",
                success(response) {
                    callback(response);
                },
                error(er) {
                    console.log("ERROR - S24_V2_Competition - getImageById(): " + er.responseText);
                    callback(null);
                },
            });
        } catch (e) {
            console.log("ERROR - S24_V2_Competition - getImageById(): " + e.message);
            callback(null);
        }
    }

    // SELECT BY ID
    public getDataById(method: string, id: string, callback: (c) => void) {
        const serviceUri = `${this.mainServiceUri}/${method}/${id}`;

        try {
            $.ajax({
                headers: this.headers,
                type: "GET",
                contentType: "application/json",
                url: serviceUri,
                dataType: "json",
                success(response) {
                    callback(response);
                },
                error(er) {
                    if (er.responseText === "" && er.status === 200 && er.statusText === "OK" && er.readyState === 4) {
                        console.log("ERROR - S24_V2_Competition - " + method + "(): The competition does not exist or has been deleted.");
                    } else {
                        console.log("ERROR - S24_V2_Competition - " + method + "(): " + er.responseText);
                    }
                    callback(null);
                },
            });
        } catch (e) {
            console.log("ERROR - S24_V2_Competition - " + method + "(): " + e.message);
            callback(null);
        }
    }

    // SELECT BY ID
    public getDataByIdWithParams(method: string, id: string, params: string, callback: (c) => void) {
        const serviceUri = `${this.mainServiceUri}/${method}/${id}/${params}`;

        try {
            $.ajax({
                headers: this.headers,
                type: "GET",
                contentType: "application/json",
                url: serviceUri,
                dataType: "json",
                success(response) {
                    callback(response);
                },
                error(er) {
                    if (er.responseText === "" && er.status === 200 && er.statusText === "OK" && er.readyState === 4) {
                        console.log("ERROR - S24_V2_Competition - " + method + "(): The competition does not exist or has been deleted.");
                    } else {
                        console.log("ERROR - S24_V2_Competition - " + method + "(): " + er.responseText);
                    }
                    callback(null);
                },
            });
        } catch (e) {
            console.log("ERROR - S24_V2_Competition - " + method + "(): " + e.message);
            callback(null);
        }
    }

    // DELETE
    public deleteData(id: string, callback: (c) => void) {
        const serviceUri = `${this.mainServiceUri}/DeleteCompetition/${id}`;

        try {
            $.ajax({
                headers: this.headers,
                type: "DELETE",
                url: serviceUri,
                success(response) {
                    callback(response);
                },
                error(er) {
                    console.log("ERROR - S24_V2_Competition - DeleteCompetition(): " + er.responseText);
                    callback(null);
                },
            });
        } catch (e) {
            console.log("ERROR - S24_V2_Competition - DeleteCompetition()2: " + e.message);
            callback(null);
        }
    }

    public addFollower(id: string, followId: string, callback: (c) => void) {
        const serviceUri = `${this.mainServiceUri}/AddFollowerForSalesPerson/${id}/${followId}`;

        try {
            $.ajax({
                headers: this.headers,
                type: "PUT",
                url: serviceUri,
                success(response) {
                    callback(response);
                },
                error(er) {
                    console.log("ERROR - S24_V2_Competition - addFollower(): " + er.responseText);
                    callback(null);
                },
            });
        } catch (e) {
            console.log("ERROR - S24_V2_Competition - addFollower()2: " + e.message);
            callback(null);
        }
    }

    public deleteFollower(id: string, followId: string, callback: (c) => void) {
        const serviceUri = `${this.mainServiceUri}/RemoveSalespersonAsFollower/${id}/${followId}`;

        try {
            $.ajax({
                headers: this.headers,
                type: "DELETE",
                url: serviceUri,
                success(response) {
                    callback(response);
                },
                error(er) {
                    console.log("ERROR - S24_V2_Competition - deleteFollower(): " + er.responseText);
                    callback(null);
                },
            });
        } catch (e) {
            console.log("ERROR - S24_V2_Competition - deleteFollower()2: " + e.message);
            callback(null);
        }
    }
}
