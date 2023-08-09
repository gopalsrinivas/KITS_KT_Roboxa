from flask_restx import Namespace, fields, Resource
from schemas.lab import LabSchema
from flask import request
from sqlalchemy import exc
from models.lab import LabModel
from models.users import UserModel

lab_ns = Namespace("lab", description="lab related operations")
labs_ns = Namespace("labs", description="labs related operations")


lab_schema = LabSchema()
lab_list_schema = LabSchema(many=True)

lab = lab_ns.model(
    "lab",
    {
        "cro_code": fields.String(required=True),
        "cro_name": fields.String(required=True),
        "legal_cro_name": fields.String(required=True),
        "address_1": fields.String(required=True),
        "address_2": fields.String(),
        "city": fields.String(required=True),
        "district": fields.String(),
        "region": fields.String(required=True),
        "zip_code": fields.String(required=True),
        "country": fields.String(required=True),
        "mobile_telephone": fields.String(required=True),
        "office_telephone": fields.String(required=True),
        "extension": fields.String(required=True),
        "email": fields.String(required=True),
        "website": fields.String(required=True),
    },
)

update_lab = lab_ns.model(
    "Updatelab",
    {
        "cro_id": fields.String(required=True),
        "cro_code": fields.String(required=True),
        "cro_name": fields.String(required=True),
        "legal_cro_name": fields.String(required=True),
        "address_1": fields.String(required=True),
        "address_2": fields.String(),
        "address_3": fields.String(),
        "address_4": fields.String(),
        "city": fields.String(required=True),
        "district": fields.String(required=True),
        "region": fields.String(required=True),
        "zip_code": fields.String(required=True),
        "country": fields.String(required=True),
        "office_telephone": fields.String(required=True),
        "extension": fields.String(required=True),
        "email": fields.String(required=True),
        "website": fields.String(required=True),
    },
)


class LabsList(Resource):
    @labs_ns.doc("Get all the cros")
    def get(self):
        return (lab_list_schema.dump(LabModel.find_all()), 200)


class LabActionsById(Resource):
    @lab_ns.doc("get by id")
    def get(self, lab_id):
        try:
            cro_data = LabModel.get_by_id(lab_id)
            if not cro_data:
                return {"message": "lab data not found"}, 400
            return (lab_schema.dump(cro_data), 200)
        except (Exception, exc.SQLAlchemyError) as e:
            print(e)
            return {"error": "failed to get the data {}".format(str(e))}, 500


class Lab(Resource):
    @lab_ns.expect(lab)
    @lab_ns.doc("Create a cro")
    def post(self):
        cro_json = request.get_json()
        try:
            cro_data = lab_schema.load(cro_json)
            cro_data.save_to_db()
        except (Exception, exc.SQLAlchemyError) as e:
            print(e)
            return {"error": "failed to save data {}".format(str(e))}, 500
        return {"data": [], "message": "success"}, 201

    @lab_ns.expect(update_lab)
    @lab_ns.doc("Update a cro")
    def put(self):
        request_json = request.get_json()
        try:
            cro_data = LabModel.get_by_id(request_json["cro_id"])
            if not cro_data:
                return {"message": "cro data not found"}, 500
            for key, value in request_json.items():
                if hasattr(cro_data, key) and value is not None:
                    setattr(cro_data, key, value)
            cro_data.save_to_db()
        except (Exception, exc.SQLAlchemyError) as e:
            print(e)
            return {"error": "failed to update data {}".format(str(e))}, 500
        return {"data": [], "message": "updated cro data successfully"}, 201